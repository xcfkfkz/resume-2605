import createGlobalWorkerPool from '../workers/createGlobalWorkerPool'
import workerDispatcher from '../workers/workerDispatcher'
import { type as CORRECT_ROTATE } from '../workers/correctRotateWorker.worker'

export default function correctRotate({ arrayBuffer }) {
	const workerPool = createGlobalWorkerPool(workerDispatcher)
	return workerPool
		.run(
			{
				task: CORRECT_ROTATE,
				params: {
					arrayBuffer,
					angle: 90
				}
			},
			{
				transferList: [arrayBuffer] as any
			}
		)
		.then(({ error, result, arrayBuffer }) => {
			if (error) {
				return Promise.reject(Object.assign(error, { buffer: Buffer.from(arrayBuffer) }))
			} else {
				return Buffer.from(result)
			}
		})
}