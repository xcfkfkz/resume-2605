import { from, mergeMap, toArray, lastValueFrom, map, defer, pipe } from 'rxjs';
import { sortBy } from 'lodash-es';

type PromiseFactory = () => Promise<unknown>

export default function promiseAllSettled(promiseFactories: PromiseFactory[], concurrent: number) {
	return lastValueFrom(
		pipe(
			mergeMap(
				([factory, index]: [PromiseFactory, number]) =>
					defer(() =>
						factory().then(
							response => ({ status: 'fulfilled', value: response, index }),
							error => ({ status: 'rejected', reason: error, index }),
						),
					),
				concurrent,
			),
			toArray(),
			map(results => sortBy(results, 'index')),
		)(from(promiseFactories.map((factory, index) => [factory, index] as [PromiseFactory, number]))),
	);
}
