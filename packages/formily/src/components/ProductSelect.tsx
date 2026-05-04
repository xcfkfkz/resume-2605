import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { pick } from 'lodash-es'
import stringifyInOrder from '@/utils/stringifyInOrder.ts';

const FIELD_WHITE_LIST = ['productId', 'orderId']

const options = [
	{
		productName: 'AAA',
		productId: '111',
		orderId: 'X'
	},
	{
		productName: 'BBB',
		productId: '222',
		orderId: 'Y'
	}
].map(({ productName, ...props }) => ({
	label: productName,
	value: stringifyInOrder(
		pick(props, FIELD_WHITE_LIST)
	)
}))

export default function ProductSelect(props: SelectProps<string>) {
	return (
		<Select
			options={options}
			{...props}
		/>
	)
}