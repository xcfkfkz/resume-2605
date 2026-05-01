export default async function getStream(params: MediaTrackConstraints) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: {
        ideal: 1080,
      },
      /*deviceId: {
        exact,
      },*/
      ...params,
    },
  });
  const [track] = stream.getVideoTracks();
  if (!track) {
    throw new Error('No video track found');
  }
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();
  return {
    stream,
    track,
    capabilities,
    settings,
  };
}
