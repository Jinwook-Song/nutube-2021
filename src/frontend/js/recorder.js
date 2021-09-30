import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStart);

  ////////////////////// virtual environment //////////////////////
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  // convert and encode with 60 frame
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  // screenshot
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  ////////////////////// virtual environment //////////////////////

  // for Video
  const videoA = document.createElement("a");
  videoA.href = mp4Url;
  videoA.download = "My Recording.mp4";
  document.body.appendChild(videoA);
  videoA.click();
  document.body.removeChild(videoA);

  // for Thumbnail
  const thumbnailA = document.createElement("a");
  thumbnailA.href = thumbUrl;
  thumbnailA.download = "My Thumbnail.jpg";
  document.body.appendChild(thumbnailA);
  thumbnailA.click();
  document.body.removeChild(thumbnailA);

  init();
};

const hanldeStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", hanldeStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", hanldeStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    // only Browser, not Server
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
