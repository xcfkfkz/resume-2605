import { useRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import playVideo from '@/utils/mediaDevices/playVideo';

export default (options?: Options<void, [HTMLVideoElement, MediaStream]>) => {
  return useRequest(playVideo, {
    manual: true,
    onSuccess(_: void, [videoNode, _stream]: [HTMLVideoElement, MediaStream]) {
      videoNode.play()
    },
    ...options
  })
}
