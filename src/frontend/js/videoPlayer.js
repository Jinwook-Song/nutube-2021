const videoContainer = document.querySelector("#videoContainer"),
  videoControls = document.querySelector("#videoControls"),
  video = document.querySelector("video"),
  playBtn = document.querySelector("#play"),
  playBtnIcon = playBtn.querySelector("i"),
  muteBtn = document.querySelector("#mute"),
  muteBtnIcon = muteBtn.querySelector("i"),
  volumeRange = document.querySelector("#volume"),
  currentTime = document.querySelector("#currentTime"),
  totalTime = document.querySelector("#totalTime"),
  timeline = document.querySelector("#timeline"),
  fullScreenBtn = document.querySelector("#fullScreen"),
  fullScreenIcon = fullScreenBtn.querySelector("i");

let controlMouseLeaveTimeout = null;
let controlMovementTimeout = null;
video.volume = 0.5; // default volume

const handlePlayClick = () => {
  video.paused
    ? (video.play(), (playBtnIcon.classList = "fas fa-pause"))
    : (video.pause(), (playBtnIcon.classList = "fas fa-play"));
};

const handleMuteClick = () => {
  if (video.volume === 0) {
    return;
  }
  const currentVolume = video.volume;
  video.muted = !video.muted;
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : currentVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value: volumeValue },
  } = event;
  volumeValue === "0"
    ? ((video.muted = true), (muteBtnIcon.classList = "fas fa-volume-mute"))
    : ((video.muted = false), (muteBtnIcon.classList = "fas fa-volume-up"));
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
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
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

const handleKeyPress = (event) => {
  const { key } = event;
  if (key === " ") {
    handlePlayClick();
  }
};

////////////////////// for view record ////////////////////////////////
const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("click", handlePlayClick);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
window.addEventListener("keypress", handleKeyPress);

if (video.readyState == 4) {
  handleLoadedMetaData();
}
