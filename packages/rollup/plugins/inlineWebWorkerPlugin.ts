export default function inlineWebWorkerPlugin() {
	return {
		name: 'rollup-plugin-inline-web-worker-plugin',
		transform(raw: string, id: string) {
			if (new URLSearchParams(id.split('?')[1]).has('myWorker')) {
				return `export default function WorkerWrapper() {
					return new Worker('data:application/javascript;base64,${Buffer.from(raw).toString('base64')}')
				}`
			}
		}
	}
}