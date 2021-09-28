const video = document.querySelector("video"),
  playBtn = document.querySelector("#play"),
  muteBtn = document.querySelector("#mute"),
  time = document.querySelector("#time"),
  volume = document.querySelector("#volume");

const handlePlayClick = (event) =>
  video.paused ? video.play() : video.pause();

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (evnet) => {};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
