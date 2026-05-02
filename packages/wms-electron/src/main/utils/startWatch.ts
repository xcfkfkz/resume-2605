import { basename } from 'node:path';
import chokidar from 'chokidar'
import { SyncHook } from 'tapable'
import { readFile } from 'node:fs/promises';
import { Notification } from 'electron';
import {
	distinctUntilChanged,
	Observable,
	pipe,
	map,
	defer,
	bufferCount,
	concatMap,
	mergeMap,
	catchError,
	NEVER,
	EMPTY
} from 'rxjs'
import { noop } from 'lodash-es'
import { produce } from 'immer'
import correctRotate from './correctRotate'
import extractAndResize from './extractAndResize'

interface CutParseBarcodeResponse {
	data?: {
		box?: number[]
		item_code?: string
	}
}

interface UploadImageResponse {
	ossUrl: string
}

interface PostMessageResponse {
	itemId: string
}

function cutParseBarcode(_params: { image_base64: string }): Promise<CutParseBarcodeResponse> {
	return Promise.resolve({})
}

function postMessage(_params: { title: string; content: string; srcList: unknown[]; itemId: string }): Promise<PostMessageResponse> {
	return Promise.resolve({ itemId: '' })
}

function compressImage(_buffer: Buffer): unknown {
	return null
}

function uploadImage(_params: { file: Buffer; extension: string }): Promise<UploadImageResponse> {
	return Promise.resolve({ ossUrl: '' })
}

function fileIndex(filePath: string): number {
	const fileBasename = basename(filePath)
	const match = fileBasename.match(/(\d+)/)
	return match ? +match[1]! : 0
}

type ResponseAndBufferAndFilePathPair = [CutParseBarcodeResponse, [Buffer, string]][]

const filePathHook = new SyncHook<[string]>(['filePath'])
const responseAndBufferAndFilePathPairHook = new SyncHook<[ResponseAndBufferAndFilePathPair]>(['responsePair'])
pipe(
	mergeMap((responseAndBufferAndFilePathPair: ResponseAndBufferAndFilePathPair) => {
		return pipe(catchError(() => EMPTY))(
			defer(() => {
				const extension = 'avif'
				return Promise.all(
					responseAndBufferAndFilePathPair.map(([response, [buffer, _filePath]]) => {
						return new Promise((resolve, reject) => {
							extractAndResize({ box: response.data?.box ?? [], arrayBuffer: buffer.buffer, extension })
								.then(
									(buffer) => {
										uploadImage({
											file: buffer,
											extension
										})
											.then(
												({ ossUrl }) => {
													resolve(ossUrl)
/*
													recordHook.call({
														filePath,
														status: `上传OSS成功`
													})
*/
												},
												(err) => {
													reject(err)
/*
													recordHook.call({
														filePath,
														status: `上传OSS失败：${err.message}`
													})
*/
												}
											)
									},
									(err) => {
										reject(err)
									}
								)
						})
					})
				)
			})
		)
	}, 1)
)(
	new Observable((observer) => {
		responseAndBufferAndFilePathPairHook.tap(
			'responseAndBufferAndFilePathPair',
			(responseAndBufferAndFilePathPair) => {
				observer.next(responseAndBufferAndFilePathPair)
			}
		)
	})
).subscribe(noop)
function startWatchEffects() {
	const filePath$ = new Observable<string>((observer) => {
		filePathHook.tap('filePath', (filePath) => {
			observer.next(filePath)
		})
	})
	const changedFilePath$ = pipe(distinctUntilChanged<string>())(filePath$)
	const readFilePromiseAndFilePath$ = pipe(
		map((filePath: string) => {
			const promise = readFile(filePath)
			return [promise, filePath] as [Promise<Buffer>, string]
		})
	)(changedFilePath$)
	const correctRotatePromiseAndFilePath$ = pipe(
		map(([promise, filePath]) => {
			return [
				new Promise((resolve, reject) => {
					promise.then((buffer) => {
						const promise2 = correctRotate({
							arrayBuffer: buffer.buffer
						})
						resolve(promise2)
					}, reject)
				}),
				filePath
			] as [Promise<Buffer>, string]
		})
	)(readFilePromiseAndFilePath$)
	const cutParseBarcodePromise$ = pipe(
		map(([promise, filePath]) => {
			return new Promise<[CutParseBarcodeResponse, [Buffer, string]]>((resolve, reject) => {
				promise.then((buffer) => {
					const promise2 = cutParseBarcode({
						image_base64: buffer.toString('base64')
					}).then((response) => {
						if ((response.data?.box?.length ?? 0) > 3) {
							return response
						} else {
							return Promise.reject(new Error('裁剪图坐标未返回'))
						}
					})
					promise2.then(
						(response) => {
							resolve([response, [buffer, filePath]])
						},
						(err) => {
							reject(err)
						}
					)
				}, reject)
			})
		})
	)(correctRotatePromiseAndFilePath$)

	const cutParseBarcodePromisePair$ = pipe(bufferCount(2))(cutParseBarcodePromise$) as Observable<Promise<[CutParseBarcodeResponse, [Buffer, string]]>[]>

	const validResponseAndBufferAndFilePathPair$ = pipe(
		concatMap((promisePair: Promise<[CutParseBarcodeResponse, [Buffer, string]]>[]) =>
			Promise.all(promisePair).then((responseAndBufferAndFilePathPair: ResponseAndBufferAndFilePathPair) => {
				const [item_code1, item_code2] = responseAndBufferAndFilePathPair.map(
					(responseAndBufferAndFilePath) => responseAndBufferAndFilePath[0].data?.item_code
				)
				if (!item_code1 && item_code2) {
					return responseAndBufferAndFilePathPair
				} else {
					const title = '拍照顺序疑似错误？'
					const content = '未按「先正后反」的顺序拍照，请核实！！！'
					new Notification({
						title,
						body: content
					}).show()
					return postMessage({
						title,
						content,
						srcList: responseAndBufferAndFilePathPair.map((responseAndBufferAndFilePath) =>
							compressImage(responseAndBufferAndFilePath[1][0] as Buffer)
						),
						itemId: item_code2!
					}).then(
						({ itemId }) => {
							return produce(responseAndBufferAndFilePathPair, (draft: ResponseAndBufferAndFilePathPair) => {
								draft[1]![0]!.data!.item_code = itemId
							})
						},
						({ message }: { message: string }) => {
							return Promise.reject(new Error(message))
						}
					)
				}
			})
		),
		catchError(() => NEVER)
	)(cutParseBarcodePromisePair$)

	return validResponseAndBufferAndFilePathPair$.subscribe((responseAndBufferAndFilePathPair) => {
		responseAndBufferAndFilePathPairHook.call(responseAndBufferAndFilePathPair as ResponseAndBufferAndFilePathPair)
	})
}

export const startWatch = (folderPath: string) => {
	const watcher = chokidar.watch(folderPath, {
		ignoreInitial: true,
		depth: 1,
		awaitWriteFinish: {
			stabilityThreshold: 500,
			pollInterval: 250
		},
		atomic: true,
		ignored: (file: string, _stats) =>
			!!(_stats?.isFile() && !['JPG', 'jpg'].some((ext) => file.endsWith(`.${ext}`)))
	})
	startWatchEffects()

	const fileQueue = new Map<number, string>()
	let currentFileIndex: number | undefined
	watcher.on('add', (filePath) => {
		const index = fileIndex(filePath)
		if (!currentFileIndex) currentFileIndex = index
		fileQueue.set(index, filePath)
		while (fileQueue.has(currentFileIndex)) {
			const nextPath = fileQueue.get(currentFileIndex)!
			filePathHook.call(nextPath)
			fileQueue.delete(currentFileIndex)
			currentFileIndex++
		}
	})
}