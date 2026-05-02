import setTimeout2 from '@/utils/setTimeout.ts';

let cancel = () => {}

export default function App() {
	return <div>
		<button onClick={() => {
			cancel  = setTimeout2(() => {
				console.log('____----')
			}, 1000)
		}}>4444</button>
		<button
			onClick={() => {
				cancel()
			}}
		>取消</button>
	</div>
}