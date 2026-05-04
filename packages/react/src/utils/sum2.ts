function sum(...args: number[]) {
	function _rest(...args2: number[]) {
		return args2.length ? sum(...args, ...args2) : args.reduce((a, c) => a + c, 0)
	}
	_rest.valueOf = function () {
		return this()
	}
	return _rest
}

export default sum