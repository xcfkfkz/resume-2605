import type { JSX } from 'react'
import { Space } from 'antd'
import Form from './components/Form'

function App(): JSX.Element {
	return (
		<Space orientation='vertical'>
			<Form />
		</Space>
	)
}

export default App
