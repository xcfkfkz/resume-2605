
export default function setTimeout2(handler: () => void, timeout: number = 0) {
	const start = performance.now()
	let canceled = false
	function loop() {
		if (canceled) return;
		const now = performance.now()
		if (now - start >= timeout) {
			handler()
		} else {
			requestAnimationFrame(loop)
		}
	}
	requestAnimationFrame(loop)
	return () => {
		canceled = true
	}
}