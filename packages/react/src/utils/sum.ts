function sum(i: number) {
	function _rest(j?: number) {
		return typeof j === 'undefined' ? i : sum(i + j)
	}
	_rest.valueOf = function () {
		return this()
	}
	return _rest
}

export default sum

// sum(5)(9) + 4 -> 18