import createGlobalWorkerPool from '../workers/createGlobalWorkerPool'
import workerDispatcher from '../workers/workerDispatcher.js?modulePath'
import { type as EXTRACT } from '../workers/extractWorker.worker'

export default function extractAndResize({ box, arrayBuffer, extension }) {
  const workerPool = createGlobalWorkerPool(workerDispatcher)
  const [left, top, x2, y2] = box.map((v) => Math.round(v))
  const width = x2 - left
  const height = y2 - top
  const resizedWidth = 1980
  return workerPool
    .run(
      {
        task: EXTRACT,
        params: {
          arrayBuffer,
          extractOptions: {
            left,
            top,
            width,
            height
          },
          resizedWidth,
          extension
        }
      },
      {
        transferList: [arrayBuffer] as any
      }
    )
    .then(({ error, result }) => {
      if (error) {
        return Promise.reject(error)
      } else {
        return Buffer.from(result)
      }
    })
}
