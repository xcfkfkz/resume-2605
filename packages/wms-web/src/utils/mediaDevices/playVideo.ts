export default function playVideo(videoNode: HTMLVideoElement, stream: MediaStream) {
  return new Promise<void>((resolve, reject) => {
    videoNode.srcObject = stream;
    videoNode.onloadedmetadata = function () {
      videoNode.play();
      resolve();
    };
    videoNode.onerror = function (err) {
      reject(err);
    };
  });
}
