import { useRef, useState, useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useDrag, useCreation } from 'ahooks'
import { Observable, withLatestFrom } from 'rxjs'
import { SyncHook } from 'tapable'

const dragStart = 'dragStart'
const dragEnd = 'dragEnd'

interface CustomDragEvent {
  target: HTMLElement;
  offsetX: number;
  offsetY: number;
}

interface Position {
  top?: string;
  left?: string;
}

interface MoveableProps {
  initialStyle?: CSSProperties;
  children?: ReactNode;
  onPositionChange?: (style: CSSProperties) => void;
}

export default function Moveable({ initialStyle = {}, children, onPositionChange }: MoveableProps) {
  const dragStartHook = useCreation(() => new SyncHook<[CustomDragEvent]>([dragStart]), [])
  const dragEndHook = useCreation(() => new SyncHook<[CustomDragEvent]>([dragEnd]), [])
  const dragStart$ = useCreation(
    () =>
      new Observable<CustomDragEvent>((observer) => {
        dragStartHook.tap(dragStart, (ev) => {
          observer.next(ev)
        })
      }),
    []
  )
  const dragEnd$ = useCreation(
    () =>
      new Observable<CustomDragEvent>((observer) => {
        dragEndHook.tap(dragEnd, (ev) => {
          observer.next(ev)
        })
      }),
    []
  )
  const containerRef = useRef<HTMLDivElement>(null)
  useDrag(null, () => containerRef.current as HTMLElement, {
    onDragStart(ev: any) {
      dragStartHook.call(ev)
    },
    onDragEnd(ev: any) {
      dragEndHook.call(ev)
    },
  })
  useEffect(() => {
    const subscription = dragEnd$
      .pipe(withLatestFrom(dragStart$))
      .subscribe(([dragEndEvent, dragStartEvent]: [CustomDragEvent, CustomDragEvent]) => {
        const target = dragStartEvent.target
        let { top, left } = target.style || {}
        if ([top, left].some(v => !v)) {
          const computedStyle = getComputedStyle(target)
          top = computedStyle.top
          left = computedStyle.left
        }
        const offsetXDiff = dragEndEvent.offsetX - dragStartEvent.offsetX
        const offsetYDiff = dragEndEvent.offsetY - dragStartEvent.offsetY
        const nextTop = parseInt(top) + offsetYDiff
        const nextLeft = parseInt(left) + offsetXDiff
        setTopLeft({
          left: nextLeft + 'px',
          top: nextTop + 'px',
        })
      })
    return () => subscription.unsubscribe()
  }, [])
  const [topLeft, setTopLeft] = useState<Position>({})
  const style = useCreation(() => {
    return {
      ...initialStyle,
      ...topLeft,
    }
  }, [topLeft])
  useEffect(() => {
    onPositionChange?.(style)
  }, [style])
  return (
    <div ref={containerRef} style={style}>
      {children}
    </div>
  )
}
