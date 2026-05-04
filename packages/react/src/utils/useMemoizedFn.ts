import { useRef } from 'react'

export default function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T {
	const fnRef = useRef(fn)
	fnRef.current = fn
	const memoizedFnRef = useRef<((...args: Parameters<T>) => ReturnType<T>) | null>(null)
	if (!memoizedFnRef.current) {
		memoizedFnRef.current = function (this: unknown, ...args: Parameters<T>) {
			return fnRef.current.apply(this, args)
		}
	}
	return memoizedFnRef.current as T
}