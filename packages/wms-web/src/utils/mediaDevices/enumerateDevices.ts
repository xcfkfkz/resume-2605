export default async function enumerateDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(({ kind }) => kind === 'videoinput');
    return Array.from(videoDevices);
  } catch {
    return []
  }
}
