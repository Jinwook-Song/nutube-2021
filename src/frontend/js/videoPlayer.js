const video = document.querySelector("video"),
  playBtn = document.querySelector("#play"),
  muteBtn = document.querySelector("#mute"),
  time = document.querySelector("#time"),
  volumeRange = document.querySelector("#volume");

video.volume = 0.5; // default volume

const handlePlayClick = () => {
  video.paused
    ? (video.play(), (playBtn.innerText = "Play"))
    : (video.pause(), (playBtn.innerText = "Pause"));
};

const handleMuteClick = () => {
  if (video.volume === 0 && muteBtn.innerText === "Unmute") {
    return;
  }
  const currentVolume = video.volume;
  video.muted = !video.muted;
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : currentVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value: volumeValue },
  } = event;
  volumeValue === "0"
    ? ((video.muted = true), (muteBtn.innerText = "Unmute"))
    : ((video.muted = false), (muteBtn.innerText = "Mute"));
  video.volume = volumeValue;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
