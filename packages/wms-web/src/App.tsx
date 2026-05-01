import Moveable from './components/Moveable.tsx';

export default function App() {
	return <div>
		<Moveable initialStyle={{ position: 'absolute', top: 0, left: 0}}>444</Moveable>
	</div>
}