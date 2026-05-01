import { useRef } from 'react';
import { useRequest } from 'ahooks';
import { scan } from 'qr-scanner-wechat';
import { message, Spin } from 'antd';
import { last } from 'lodash-es';
import CameraSwitcher from '@/icons/CameraSwitcher';
import getStream from '@/utils/mediaDevices/getStream';
import useDevices from '@/models/useDevices';
import useVideoPlay from '@/models/useVideoPlay';

export default function QrScanner({ onChange }: { onChange: (barcode: string) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { data: devices, refreshAsync, loading: l0 } = useDevices({
    onSuccess(devices: MediaDeviceInfo[]) {
      if (devices?.length) {
        const lastDevice = last(devices);
        if (lastDevice) {
          run((lastDevice as MediaDeviceInfo).deviceId);
        }
      }
    },
  });
  const { run, params, loading: l1 } = useRequest(
    (deviceId: string) =>
      getStream({
        ...(deviceId
          ? {
              deviceId: {
                exact: deviceId,
              },
            }
          : void 0),
        width: {
          ideal: 1080,
        },
      }),
    {
      manual: true,
      onSuccess({ stream }) {
        if (ref.current) {
          playVideo(ref.current, stream);
        }
      },
      onBefore() {
        cancelPlay();
      },
    },
  );
  const { run: playVideo, cancel: cancelPlay, loading: l2 } = useVideoPlay({
    onSuccess(_: void, [videoNode, stream]: [HTMLVideoElement, MediaStream]) {
      videoNode.play();
      const track = stream.getVideoTracks()[0];
      if (track) {
        scanBarCode({ track });
      }
    },
    onBefore() {
      cancelScan();
    },
  });
  const { run: scanBarCode, cancel: cancelScan } = useRequest(
    async ({ track }: { track: MediaStreamTrack }) => {
      // @ts-ignore - ImageCapture is not yet typed in TypeScript
      const imageCapture = new (window as any).ImageCapture(track);
      const imageBitmap = await imageCapture.grabFrame();
      const { width, height } = imageBitmap;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imageBitmap, 0, 0, width, height);
      }
      const promise = scan(canvas);
      promise.finally(() => {
        imageBitmap.close();
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
        }
      });
      return promise;
    },
    {
      manual: true,
      pollingInterval: 250,
      onSuccess(result) {
        const barcode = result?.text;
        if (barcode && barcode !== previousBarcode.current) {
          onChange(barcode)
          previousBarcode.current = barcode;
          message.success({ content: `识别成功: ${barcode}`, style: { wordBreak: 'break-all' } });
        }
      },
    },
  );
  const previousBarcode = useRef<string | null>(null);
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'absolute', zIndex: 2, top: 20, right: 20, fontSize: 60 }}>
        <Spin spinning={l0 || l1 || l2}>
          <CameraSwitcher
            onClick={() => {
              const toggleDevice = (devices: MediaDeviceInfo[], currentDeviceId: string) => {
                const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
                if (currentIndex > -1 && currentIndex < devices.length - 1) {
                  const nextDevice = devices[currentIndex + 1];
                  if (nextDevice) {
                    run(nextDevice.deviceId);
                  }
                } else {
                  const firstDevice = devices[0];
                  if (firstDevice) {
                    run(firstDevice.deviceId);
                  }
                }
              };
              const currentDeviceId = params[0];
              if (devices?.length && currentDeviceId) {
                toggleDevice(devices, currentDeviceId);
              } else {
                refreshAsync().then((devices: MediaDeviceInfo[]) => {
                  const firstDeviceId = devices[0]?.deviceId;
                  if (firstDeviceId) {
                    toggleDevice(devices, firstDeviceId);
                  }
                });
              }
            }}
          />
        </Spin>
      </div>
      <video
        ref={ref}
        style={{ width: '100%', height: '100%' }}
        muted
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
      />
    </div>
  );
}
