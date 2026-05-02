import { Space, Input, Button } from 'antd'
import type { ButtonProps } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'

export default function FolderPicker({ value, onChange, buttonProps }: { value?: string, onChange?: (v: string) => void, buttonProps?: ButtonProps }) {
	return (
		<Space.Compact>
			<Input disabled placeholder="请选择文件夹" value={value} />
			<Button
				onClick={async () => {
					const nextFilePath = await window.electron.ipcRenderer.invoke('choose-directory')
					onChange?.(nextFilePath)
				}}
				{...buttonProps}
			>
				<FolderOpenOutlined />
			</Button>
		</Space.Compact>
	)
}
