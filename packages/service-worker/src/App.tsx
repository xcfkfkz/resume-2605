export default function App() {
	return <div>
		<button
			onClick={() => {
				fetch('https://github.com/signin/login/phone', {
					method: 'POST',
					body: JSON.stringify({
						phone: 15112558163,
						code: '0'
					})
				})
			}}
		>4444</button>
		<button
			onClick={() => {
				fetch('https://github.com/order-web/shop/v2/load-order-list', {
					method: 'POST'
				})
			}}
		>6</button>
	</div>
}