import { useEffect, useRef, useCallback } from 'react'

export default function useInternal(fn: () => void, interval: number) {
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const clear = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current)
		}
	}, [])
	const fnRef = useRef(fn)
	fnRef.current = fn
	useEffect(() => {
		timerRef.current = setInterval(() => {
			fnRef.current()
		}, interval)
		return clear
	}, [interval])
	return clear
}