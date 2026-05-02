import { Piscina, ArrayTaskQueue } from 'piscina'
import { cpus } from 'node:os'
import { once } from 'lodash-es'

export default once(function createGlobalWorkerPool(workerPath) {
	const minThreads = 2
	return new Piscina({
		filename: workerPath,
		maxThreads: Math.max(minThreads, Math.floor(cpus().length * 0.75)),
		minThreads,
		idleTimeout: 30000,
		taskQueue: new ArrayTaskQueue()
	})
})
