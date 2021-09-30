const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleDownload);
  startBtn.addEventListener("click", handleStart);

  const a = document.createElement("a");
  a.href = videoFile;
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
