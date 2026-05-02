import { Form, Button } from 'antd'
import FolderPicker from '@renderer/components/FolderPicker.tsx';

export default function Form2() {
	const [form] = Form.useForm()
	return (
		<Form form={form} layout="inline">
			<Form.Item name="folderPath" rules={[{ required: true }]}>
				<FolderPicker />
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					onClick={async () => {
						const { folderPath } = await form.validateFields()
						return window.electron.ipcRenderer.invoke('start-watch', folderPath)
					}}
				>
					开始监听
				</Button>
			</Form.Item>
		</Form>
	)
}