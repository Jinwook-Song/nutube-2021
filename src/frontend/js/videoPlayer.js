const videoContainer = document.querySelector("#videoContainer"),
  videoControls = document.querySelector("#videoControls"),
  video = document.querySelector("video"),
  playBtn = document.querySelector("#play"),
  muteBtn = document.querySelector("#mute"),
  volumeRange = document.querySelector("#volume"),
  currentTime = document.querySelector("#currentTime"),
  totalTime = document.querySelector("#totalTime"),
  timeline = document.querySelector("#timeline"),
  fullScreenBtn = document.querySelector("#fullScreen");

let controlMouseLeaveTimeout = null;
let controlMovementTimeout = null;
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

const formatTime = (seconds) => {
  if (seconds >= 3600) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value: timeLineValue },
  } = event;
  video.currentTime = timeLineValue;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlMouseLeaveTimeout) {
    clearTimeout(controlMouseLeaveTimeout);
    controlMouseLeaveTimeout = null;
  }
  if (controlMovementTimeout) {
    clearTimeout(controlMovementTimeout);
    controlMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlMouseLeaveTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);

if (video.readyState == 4) {
  handleLoadedMetaData();
}
