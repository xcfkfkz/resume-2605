type Orderable = Record<string, unknown> | unknown[] | unknown;

function orderObject(object: Orderable, set: Set<unknown> = new Set()): Orderable {
	if (set.has(object)) {
		return object
	} else {
		set.add(object);
		switch (Object.prototype.toString.call(object)) {
			case '[object Array]':
				return (object as unknown[]).map((value) => orderObject(value))
			case '[object Object]':
				return Object.fromEntries(
					Object.entries(object as Record<string, unknown>).sort((a, b) => a[0].localeCompare(b[0])),
				)
			default:
				return object
		}
	}
}

export default (object: Orderable) => JSON.stringify(orderObject(object))
