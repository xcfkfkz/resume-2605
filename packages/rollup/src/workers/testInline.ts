console.log('inline worker exec')
self.onmessage = function (ev) {
	console.log('onmessage', ev)
}