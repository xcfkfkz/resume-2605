import { forwardRef, useEffect } from "react";
import type { ComponentProps, ClipboardEvent } from 'react'
import { Input } from "antd";
import type { TextAreaRef } from "antd/es/input/TextArea";
import { useCreation } from "ahooks";
import { Observable, pipe, type OperatorFunction } from "rxjs";
import { SyncHook } from "tapable";
import timeGapFilter from "../utils/timeGapFilter";

interface ChangeEvent {
  target: { value: string };
  timeStamp: number;
}

interface ScannerInputProps extends Omit<ComponentProps<typeof Input.TextArea>, 'onChange' | 'onPaste'> {
  onChange?: (ev: ChangeEvent) => void;
  onPaste?: (ev: ClipboardEvent<HTMLTextAreaElement>) => void;
}

export default forwardRef<TextAreaRef, ScannerInputProps>(function ScannerInput(props, ref) {
  const changeHook = useCreation(() => new SyncHook<[ChangeEvent]>(["change"]), []);
  const change$ = useCreation(
    () =>
      new Observable<ChangeEvent>((observer) => {
        changeHook.tap("change", (ev) => {
          observer.next(ev);
        });
      }),
    []
  );
  const change2$ = useCreation(() => {
    return pipe(timeGapFilter(110) as OperatorFunction<ChangeEvent, ChangeEvent>)(change$);
  }, [change$]);
  useEffect(() => {
    const subscription = change2$.subscribe((ev) => {
      props.onChange?.(ev);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [change2$]);
  return (
    <Input.TextArea
      ref={ref}
      {...props}
      onChange={(ev) => {
        changeHook.call(ev);
      }}
      onPaste={(ev) => {
        ev.preventDefault();
        props.onPaste?.(ev);
      }}
    />
  );
});
