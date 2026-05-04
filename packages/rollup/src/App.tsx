import testInlineWorker from './workers/testInline?myWorker'

export default function App() {

	return <div>
		<div>4</div>
		<button
			onClick={() => {
				const worker = testInlineWorker()
				worker.postMessage({
					data: '33'
				})
			}}
		>7</button>
	</div>
}