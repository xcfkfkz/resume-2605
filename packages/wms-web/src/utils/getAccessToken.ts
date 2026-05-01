import { once } from 'lodash-es';
import {
  pipe,
  interval,
  Subject,
  mergeWith,
  switchMap,
  share,
  startWith,
  BehaviorSubject,
  defer,
  catchError,
  EMPTY,
  of,
} from 'rxjs';

export default once(() => {
  const gap = 1800000;
  const refreshInterval$ = interval(gap);
  const manualRefresh$ = new Subject<void>();
  const refresh$ = pipe(mergeWith(pipe(startWith(0))(manualRefresh$)))(refreshInterval$);
  const data$ = pipe(
    switchMap(() =>
      pipe(catchError(() => EMPTY))(
        defer(() => {
          /* your request */
          return of(undefined);
        }),
      ),
    ),
    share(),
  )(refresh$);
  const latestDataSubject = new BehaviorSubject<any>(undefined);
  data$.subscribe(latestDataSubject);
  return [
    () =>
      new Promise<any>(resolve => {
        const latestData = latestDataSubject.getValue();
        if (latestData) {
          resolve(latestData);
        } else {
          data$.subscribe(data => {
            resolve(data);
          });
        }
      }),
    () => manualRefresh$.next(undefined),
  ];
});
