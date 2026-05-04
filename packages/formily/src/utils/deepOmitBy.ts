import { omitBy, mapValues } from 'lodash-es';

type DeepOmitable = Record<string, unknown> | unknown[] | unknown;

export default function deepOmitBy(object: DeepOmitable, predicate: (value: unknown, key: string) => boolean, set: Set<unknown> = new Set()): DeepOmitable {
	const type = Object.prototype.toString.call(object);
	if (set.has(object)) {
		return object;
	} else {
		set.add(object);
		switch (type) {
			case '[object Object]':
				return omitBy(
					mapValues(object as Record<string, unknown>, value => deepOmitBy(value, predicate, set)),
					predicate,
				);
			case '[object Array]':
				return (object as unknown[]).map(value => deepOmitBy(value, predicate, set));
			default:
				return object;
		}
	}
}
