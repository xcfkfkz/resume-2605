import { run as correctRotate, type as CORRECT_ROTATE } from './correctRotateWorker.worker'
import { run as extract, type as EXTRACT } from './extractWorker.worker'

export default function workerDispatcher({ task, params }) {
  switch (task) {
    case CORRECT_ROTATE:
      return correctRotate(params)
    case EXTRACT:
      return extract(params)
    default:
      throw new Error(`Unknown task: ${task}`)
  }
}
