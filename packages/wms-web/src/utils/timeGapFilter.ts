import { noop } from 'lodash-es';
import { operate } from 'rxjs/internal/util/lift';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';
import type { OperatorFunction } from 'rxjs';

interface ChangeEvent {
  target: { value: string };
  timeStamp: number;
}

export default function timeGapFilter(gap: number): OperatorFunction<ChangeEvent, ChangeEvent> {
	const EMPTY_VALUE = void 0
  return operate<ChangeEvent, ChangeEvent>(function (source, subscriber) {
    let previousValue: string | undefined;
    let previousTimeStamp: number | undefined;
    source.subscribe(
      createOperatorSubscriber<ChangeEvent>(
        subscriber,
        (event) => {
          const onChange = (ev: ChangeEvent) => {
            subscriber.next(ev);
            previousValue = ev.target.value;
            if (!previousValue || previousValue.endsWith('\n')) {
              previousTimeStamp = EMPTY_VALUE;
            } else {
              previousTimeStamp = event.timeStamp;
            }
          };
          if (previousTimeStamp === EMPTY_VALUE) {
            onChange(event);
          } else {
            if (event.target.value.length > (previousValue?.length ?? 0)) {
              if (event.timeStamp - previousTimeStamp < gap) {
                onChange(event);
              }
            } else {
              onChange(event);
            }
          }
        },
        noop,
        noop,
      ),
    );
  });
}
