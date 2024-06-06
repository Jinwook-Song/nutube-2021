import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const actionBtn = document.querySelector('#actionBtn');
const video = document.querySelector('#preview');

let stream;
let recorder;
let videoFile;

const files = {
  input: 'recording.webm',
  output: 'output.mp4',
  thumb: 'thumbnail.jpg',
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleDownload = async () => {
  actionBtn.innerText = 'Transcoding...';
  actionBtn.removeEventListener('click', handleDownload);
  actionBtn.disabled = true;

  ////////////////////// virtual environment //////////////////////
  const ffmpeg = new FFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: true,
  });
  await ffmpeg.load();

  await ffmpeg.writeFile(files.input, await fetchFile(videoFile));

  // convert and encode with 60 frame
  await ffmpeg.exec(['-i', files.input, '-r', '60', files.output]);

  // screenshot
  await ffmpeg.exec([
    '-i',
    files.input,
    '-ss',
    '00:00:01',
    '-frames:v',
    '1',
    files.thumb,
  ]);

  const mp4File = await ffmpeg.readFile(files.output);
  const thumbFile = await ffmpeg.readFile(files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  ////////////////////// virtual environment //////////////////////

  // Download video and thumnail
  downloadFile(mp4Url, 'My Recording.mp4');
  downloadFile(thumbUrl, 'My Thumbnail.jpg');

  // Clear memory
  await ffmpeg.deleteFile(files.input);
  await ffmpeg.deleteFile(files.output);
  await ffmpeg.deleteFile(files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = 'Record Again';
  actionBtn.addEventListener('click', handleStart);
};

const hanldeStop = () => {
  actionBtn.innerText = 'Download Recording';
  actionBtn.removeEventListener('click', hanldeStop);
  actionBtn.addEventListener('click', handleDownload);

  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = 'Stop Recording';
  actionBtn.removeEventListener('click', handleStart);
  actionBtn.addEventListener('click', hanldeStop);

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
  actionBtn.innerText = 'loading...';
  actionBtn.removeEventListener('click', init);
  actionBtn.addEventListener('click', handleStart);

  actionBtn.disabled = true;
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 512,
      height: 288,
    },
  });
  video.srcObject = stream;
  video.play();
  actionBtn.disabled = false;
  actionBtn.innerText = 'Start Recording';
};

actionBtn.addEventListener('click', init);
