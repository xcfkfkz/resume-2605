import { useRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import enumerateDevices from '@/utils/mediaDevices/enumerateDevices';

export default (options?: Options<MediaDeviceInfo[], []>) => {
  return useRequest(enumerateDevices, options)
};
