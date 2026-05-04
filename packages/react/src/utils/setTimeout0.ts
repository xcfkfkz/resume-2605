export default function setTimeout0(handler: () => void, timeout: number = 0) {
	const start = performance.now()
	let canceled = false
	const channel = new MessageChannel()
	function loop() {
		if (canceled) return
		const now = performance.now()
		if (now - start >= timeout) {
			handler()
		} else {
			channel.port1.postMessage(undefined)
		}
	}
	channel.port2.onmessage = function () {
		loop()
	}
	loop()
	return () => {
		canceled = true
	}
}