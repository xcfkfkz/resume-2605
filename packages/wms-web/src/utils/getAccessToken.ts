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
} from 'rxjs';

export default once(({ queryFn, staleTime }: { queryFn: () => Promise<unknown>, staleTime: number }) => {
  const refreshInterval$ = interval(staleTime);
  const manualRefresh$ = new Subject<void>();
  const refresh$ = pipe(mergeWith(pipe(startWith(0))(manualRefresh$)))(refreshInterval$);
  const data$ = pipe(
    switchMap(() =>
      pipe(catchError(() => EMPTY))(
        defer(() => {
          return queryFn();
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
