import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  // virtual environment
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  // convert and encode with 60 frame
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const mp4Url = URL.createObjectURL(mp4Blob);

  /////////////////////////////////////////////////////////////////
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStart);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "My Recording.mp4";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

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
