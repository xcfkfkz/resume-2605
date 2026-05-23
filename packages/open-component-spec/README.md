# An MCP Server for querying Ant Design component documentation

## AI Agent Integration

```json
{
  "mcpServers": {
    "Antd Doc": {
      "command": "npx",
      "args": ["-y", "open-antd-component-spec"]
    }
  }
}
```

## tools/call 

### Request

```json
{
  "method": "tools/call",
  "params": {
    "name": "get-component-doc",
    "arguments": {
      "name": "InputNumber",
      "version": "5.24.3"
    },
    "_meta": {
      "progressToken": 0
    }
  }
}
```

### Response

```json
{
  "name": "input-number",
  "importName": "InputNumber",
  "purpose": "当需要获取标准数值时。",
  "constraints": [],
  "props": [
    {
      "name": "addonAfter",
      "type": "ReactNode",
      "required": false,
      "default": null,
      "description": "带标签的 input，设置后置标签"
    },
    {
      "name": "addonBefore",
      "type": "ReactNode",
      "required": false,
      "default": null,
      "description": "带标签的 input，设置前置标签"
    },
    {
      "name": "autoFocus",
      "type": "boolean",
      "required": false,
      "default": false,
      "description": "自动获取焦点"
    },
    {
      "name": "changeOnBlur",
      "type": "boolean",
      "required": false,
      "default": true,
      "description": "是否在失去焦点时，触发 `onChange` 事件（例如值超出范围时，重新限制回范围并触发事件）"
    },
    {
      "name": "changeOnWheel",
      "type": "boolean",
      "required": false,
      "default": null,
      "description": "允许鼠标滚轮改变数值"
    },
    {
      "name": "controls",
      "type": "boolean \\| { upIcon?: React.ReactNode; downIcon?: React.ReactNode; }",
      "required": false,
      "default": null,
      "description": "是否显示增减按钮，也可设置自定义箭头图标"
    },
    {
      "name": "decimalSeparator",
      "type": "string",
      "required": false,
      "default": null,
      "description": "小数点"
    },
    {
      "name": "placeholder",
      "type": "string",
      "required": false,
      "default": null,
      "description": "占位符"
    },
    {
      "name": "defaultValue",
      "type": "number",
      "required": false,
      "default": null,
      "description": "初始值"
    },
    {
      "name": "disabled",
      "type": "boolean",
      "required": false,
      "default": false,
      "description": "禁用"
    },
    {
      "name": "formatter",
      "type": "function(value: number \\| string, info: { userTyping: boolean, input: string }): string",
      "required": false,
      "default": null,
      "description": "指定输入框展示值的格式"
    },
    {
      "name": "keyboard",
      "type": "boolean",
      "required": false,
      "default": true,
      "description": "是否启用键盘快捷行为"
    },
    {
      "name": "max",
      "type": "number",
      "required": false,
      "default": "[Number.MAX\\_SAFE\\_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)",
      "description": "最大值"
    },
    {
      "name": "min",
      "type": "number",
      "required": false,
      "default": "[Number.MIN\\_SAFE\\_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)",
      "description": "最小值"
    },
    {
      "name": "parser",
      "type": "function(string): number",
      "required": false,
      "default": null,
      "description": "指定从 `formatter` 里转换回数字的方式，和 `formatter` 搭配使用"
    },
    {
      "name": "precision",
      "type": "number",
      "required": false,
      "default": null,
      "description": "数值精度，配置 `formatter` 时会以 `formatter` 为准"
    },
    {
      "name": "readOnly",
      "type": "boolean",
      "required": false,
      "default": false,
      "description": "只读"
    },
    {
      "name": "status",
      "type": "'error' \\| 'warning'",
      "required": false,
      "default": null,
      "description": "设置校验状态"
    },
    {
      "name": "prefix",
      "type": "ReactNode",
      "required": false,
      "default": null,
      "description": "带有前缀图标的 input"
    },
    {
      "name": "suffix",
      "type": "ReactNode",
      "required": false,
      "default": null,
      "description": "带有后缀图标的 input"
    },
    {
      "name": "size",
      "type": "`large` \\| `middle` \\| `small`",
      "required": false,
      "default": null,
      "description": "输入框大小"
    },
    {
      "name": "step",
      "type": "number \\| string",
      "required": false,
      "default": 1,
      "description": "每次改变步数，可以为小数"
    },
    {
      "name": "stringMode",
      "type": "boolean",
      "required": false,
      "default": false,
      "description": "字符值模式，开启后支持高精度小数。同时 `onChange` 将返回 string 类型"
    },
    {
      "name": "value",
      "type": "number",
      "required": false,
      "default": null,
      "description": "当前值"
    },
    {
      "name": "variant",
      "type": "`outlined` \\| `borderless` \\| `filled` \\| `underlined`",
      "required": false,
      "default": "outlined",
      "description": "形态变体"
    },
    {
      "name": "onChange",
      "type": "function(value: number \\| string \\| null)",
      "required": false,
      "default": null,
      "description": "变化回调"
    },
    {
      "name": "onPressEnter",
      "type": "function(e)",
      "required": false,
      "default": null,
      "description": "按下回车的回调"
    },
    {
      "name": "onStep",
      "type": "(value: number, info: { offset: number, type: 'up' \\| 'down' }) => void",
      "required": false,
      "default": null,
      "description": "点击上下箭头的回调"
    }
  ],
  "examples": [
    {
      "scenario": "用于配置一些固定组合。",
      "code": "import React from 'react';\nimport { SettingOutlined } from '@ant-design/icons';\nimport { Cascader, InputNumber, Select, Space } from 'antd';\n\nconst { Option } = Select;\n\nconst selectBefore = (\n  <Select defaultValue=\"add\" style={{ width: 60 }}>\n    <Option value=\"add\">+</Option>\n    <Option value=\"minus\">-</Option>\n  </Select>\n);\nconst selectAfter = (\n  <Select defaultValue=\"USD\" style={{ width: 60 }}>\n    <Option value=\"USD\">$</Option>\n    <Option value=\"EUR\">€</Option>\n    <Option value=\"GBP\">£</Option>\n    <Option value=\"CNY\">¥</Option>\n  </Select>\n);\n\nconst App: React.FC = () => (\n  <Space direction=\"vertical\">\n    <InputNumber addonBefore=\"+\" addonAfter=\"$\" defaultValue={100} />\n    <InputNumber addonBefore={selectBefore} addonAfter={selectAfter} defaultValue={100} />\n    <InputNumber addonAfter={<SettingOutlined />} defaultValue={100} />\n    <InputNumber\n      addonBefore={<Cascader placeholder=\"cascader\" style={{ width: 150 }} />}\n      defaultValue={100}\n    />\n    <InputNumber\n      addonBefore=\"+\"\n      addonAfter={<SettingOutlined />}\n      defaultValue={100}\n      disabled\n      controls\n    />\n    <InputNumber\n      prefix=\"¥\"\n      addonBefore=\"+\"\n      addonAfter={<SettingOutlined />}\n      defaultValue={100}\n      disabled\n      controls\n    />\n  </Space>\n);\n\nexport default App;\n",
      "title": "前置/后置标签"
    },
    {
      "scenario": "数字输入框。",
      "code": "import React from 'react';\nimport type { InputNumberProps } from 'antd';\nimport { InputNumber } from 'antd';\n\nconst onChange: InputNumberProps['onChange'] = (value) => {\n  console.log('changed', value);\n};\n\nconst App: React.FC = () => <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;\n\nexport default App;\n",
      "title": "基本"
    },
    {
      "scenario": "启用鼠标滚轮控制。",
      "code": "import React from 'react';\nimport type { InputNumberProps } from 'antd';\nimport { InputNumber } from 'antd';\n\nconst onChange: InputNumberProps['onChange'] = (value) => {\n  console.log('changed', value);\n};\n\nconst App: React.FC = () => (\n  <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} changeOnWheel />\n);\n\nexport default App;\n",
      "title": "鼠标滚轮"
    },
    {
      "scenario": "可以扩展 `controls` 属性用以设置自定义图标。",
      "code": "import React from 'react';\nimport { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';\nimport { InputNumber } from 'antd';\n\nconst App: React.FC = () => (\n  <InputNumber controls={{ upIcon: <ArrowUpOutlined />, downIcon: <ArrowDownOutlined /> }} />\n);\n\nexport default App;\n",
      "title": "图标按钮"
    },
    {
      "code": "import React from 'react';\nimport { ConfigProvider, InputNumber, Space } from 'antd';\n\nexport default () => (\n  <ConfigProvider\n    theme={{\n      components: {\n        InputNumber: {\n          handleWidth: 50,\n        },\n      },\n    }}\n  >\n    <Space wrap>\n      <InputNumber />\n\n      <ConfigProvider\n        theme={{\n          components: {\n            InputNumber: {\n              handleWidth: 25,\n            },\n          },\n        }}\n      >\n        <InputNumber />\n      </ConfigProvider>\n\n      <ConfigProvider\n        theme={{\n          components: {\n            InputNumber: {\n              paddingBlockLG: 12,\n              paddingInlineLG: 16,\n            },\n          },\n        }}\n      >\n        <Space wrap>\n          <InputNumber size=\"large\" />\n          <InputNumber size=\"large\" prefix=\"$\" />\n        </Space>\n      </ConfigProvider>\n\n      <ConfigProvider\n        theme={{\n          components: {\n            InputNumber: {\n              inputFontSize: 30,\n              inputFontSizeSM: 20,\n              inputFontSizeLG: 40,\n            },\n          },\n        }}\n      >\n        <Space wrap>\n          <InputNumber defaultValue={11111} size=\"small\" />\n          <InputNumber defaultValue={11111} />\n          <InputNumber defaultValue={11111} size=\"large\" />\n        </Space>\n      </ConfigProvider>\n    </Space>\n  </ConfigProvider>\n);\n",
      "title": "覆盖组件样式"
    },
    {
      "scenario": "通过 `stringMode` 开启高精度小数支持，`onChange` 事件将返回 string 类型。对于旧版浏览器，你需要 BigInt polyfill。",
      "code": "import React from 'react';\nimport type { InputNumberProps } from 'antd';\nimport { InputNumber } from 'antd';\n\nconst onChange: InputNumberProps['onChange'] = (value) => {\n  console.log('changed', value);\n};\n\nconst App: React.FC = () => (\n  <InputNumber<string>\n    style={{ width: 200 }}\n    defaultValue=\"1\"\n    min=\"0\"\n    max=\"10\"\n    step=\"0.00000000000001\"\n    onChange={onChange}\n    stringMode\n  />\n);\n\nexport default App;\n",
      "title": "高精度小数"
    },
    {
      "scenario": "点击按钮切换可用状态。",
      "code": "import React, { useState } from 'react';\nimport { Button, InputNumber } from 'antd';\n\nconst App: React.FC = () => {\n  const [disabled, setDisabled] = useState(true);\n\n  const toggle = () => {\n    setDisabled(!disabled);\n  };\n\n  return (\n    <>\n      <InputNumber min={1} max={10} disabled={disabled} defaultValue={3} />\n      <div style={{ marginTop: 20 }}>\n        <Button onClick={toggle} type=\"primary\">\n          Toggle disabled\n        </Button>\n      </div>\n    </>\n  );\n};\n\nexport default App;\n",
      "title": "不可用"
    },
    {
      "scenario": "Filled Debug.",
      "code": "import React from 'react';\nimport { Flex, InputNumber } from 'antd';\n\nconst App: React.FC = () => (\n  <Flex vertical gap={12}>\n    <Flex gap={12}>\n      <InputNumber placeholder=\"Filled\" variant=\"filled\" />\n      <InputNumber placeholder=\"Filled\" variant=\"filled\" disabled />\n      <InputNumber placeholder=\"Filled\" variant=\"filled\" status=\"error\" />\n    </Flex>\n    <Flex gap={12}>\n      <InputNumber prefix=\"$\" placeholder=\"Filled\" variant=\"filled\" />\n      <InputNumber prefix=\"$\" placeholder=\"Filled\" variant=\"filled\" disabled />\n      <InputNumber prefix=\"$\" placeholder=\"Filled\" variant=\"filled\" status=\"error\" />\n    </Flex>\n    <Flex gap={12}>\n      <InputNumber addonBefore=\"http://\" addonAfter=\".com\" placeholder=\"Filled\" variant=\"filled\" />\n      <InputNumber\n        addonBefore=\"http://\"\n        addonAfter=\".com\"\n        placeholder=\"Filled\"\n        variant=\"filled\"\n        disabled\n      />\n      <InputNumber\n        addonBefore=\"http://\"\n        addonAfter=\".com\"\n        placeholder=\"Filled\"\n        variant=\"filled\"\n        status=\"error\"\n      />\n    </Flex>\n    <Flex gap={12}>\n      <InputNumber addonAfter=\".com\" placeholder=\"Filled\" variant=\"filled\" />\n      <InputNumber addonAfter=\".com\" placeholder=\"Filled\" variant=\"filled\" disabled />\n      <InputNumber addonAfter=\".com\" placeholder=\"Filled\" variant=\"filled\" status=\"error\" />\n    </Flex>\n    <Flex gap={12}>\n      <InputNumber addonBefore=\"http://\" placeholder=\"Filled\" variant=\"filled\" />\n      <InputNumber addonBefore=\"http://\" placeholder=\"Filled\" variant=\"filled\" disabled />\n      <InputNumber addonBefore=\"http://\" placeholder=\"Filled\" variant=\"filled\" status=\"error\" />\n    </Flex>\n  </Flex>\n);\n\nexport default App;\n",
      "title": "Filled Debug"
    },
    {
      "scenario": "聚焦额外配置属性。",
      "code": "import React, { useRef } from 'react';\nimport { Button, InputNumber, Space } from 'antd';\nimport type { InputNumberRef } from 'rc-input-number';\n\nconst App: React.FC = () => {\n  const inputRef = useRef<InputNumberRef>(null);\n\n  return (\n    <Space direction=\"vertical\" style={{ width: '100%' }}>\n      <Space wrap>\n        <Button\n          onClick={() => {\n            inputRef.current!.focus({\n              cursor: 'start',\n            });\n          }}\n        >\n          Focus at first\n        </Button>\n        <Button\n          onClick={() => {\n            inputRef.current!.focus({\n              cursor: 'end',\n            });\n          }}\n        >\n          Focus at last\n        </Button>\n        <Button\n          onClick={() => {\n            inputRef.current!.focus({\n              cursor: 'all',\n            });\n          }}\n        >\n          Focus to select all\n        </Button>\n        <Button\n          onClick={() => {\n            inputRef.current!.focus({\n              preventScroll: true,\n            });\n          }}\n        >\n          Focus prevent scroll\n        </Button>\n      </Space>\n      <InputNumber style={{ width: '100%' }} defaultValue={999} ref={inputRef} />\n    </Space>\n  );\n};\n\nexport default App;\n",
      "title": "聚焦"
    },
    {
      "scenario": "通过 `formatter` 格式化数字，以展示具有具体含义的数据，往往需要配合 `parser` 一起使用。\n\n> 这里有一个更复杂的货币格式化输入框：<https://codesandbox.io/s/currency-wrapper-antd-input-3ynzo>",
      "code": "import React from 'react';\nimport type { InputNumberProps } from 'antd';\nimport { InputNumber, Space } from 'antd';\n\nconst onChange: InputNumberProps['onChange'] = (value) => {\n  console.log('changed', value);\n};\n\nconst App: React.FC = () => (\n  <Space>\n    <InputNumber<number>\n      defaultValue={1000}\n      formatter={(value) => `$ ${value}`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\n      parser={(value) => value?.replace(/\\$\\s?|(,*)/g, '') as unknown as number}\n      onChange={onChange}\n    />\n    <InputNumber<number>\n      defaultValue={100}\n      min={0}\n      max={100}\n      formatter={(value) => `${value}%`}\n      parser={(value) => value?.replace('%', '') as unknown as number}\n      onChange={onChange}\n    />\n  </Space>\n);\n\nexport default App;\n",
      "title": "格式化展示"
    },
    {
      "scenario": "使用 `keyboard` 属性可以控制键盘行为。",
      "code": "import React, { useState } from 'react';\nimport { Checkbox, InputNumber, Space } from 'antd';\n\nconst App: React.FC = () => {\n  const [keyboard, setKeyboard] = useState(true);\n\n  return (\n    <Space>\n      <InputNumber min={1} max={10} keyboard={keyboard} defaultValue={3} />\n      <Checkbox\n        onChange={() => {\n          setKeyboard(!keyboard);\n        }}\n        checked={keyboard}\n      >\n        Toggle keyboard\n      </Checkbox>\n    </Space>\n  );\n};\n\nexport default App;\n",
      "title": "键盘行为"
    },
    {
      "scenario": "当通过受控将 `value` 超出边界时，提供警告样式。",
      "code": "import React, { useState } from 'react';\nimport { Button, InputNumber, Space } from 'antd';\n\nconst App: React.FC = () => {\n  const [value, setValue] = useState<string | number | null>('99');\n\n  return (\n    <Space>\n      <InputNumber min={1} max={10} value={value} onChange={setValue} />\n      <Button\n        type=\"primary\"\n        onClick={() => {\n          setValue(99);\n        }}\n      >\n        Reset\n      </Button>\n    </Space>\n  );\n};\n\nexport default App;\n",
      "title": "超出边界"
    },
    {
      "scenario": "在输入框上添加前缀或后缀图标。",
      "code": "import React from 'react';\nimport { UserOutlined } from '@ant-design/icons';\nimport { InputNumber } from 'antd';\n\nconst App: React.FC = () => (\n  <>\n    <InputNumber prefix=\"￥\" style={{ width: '100%' }} />\n    <br />\n    <br />\n    <InputNumber addonBefore={<UserOutlined />} prefix=\"￥\" style={{ width: '100%' }} />\n    <br />\n    <br />\n    <InputNumber prefix=\"￥\" disabled style={{ width: '100%' }} />\n    <br />\n    <br />\n    <InputNumber suffix=\"RMB\" style={{ width: '100%' }} />\n  </>\n);\n\nexport default App;\n",
      "title": "前缀/后缀"
    },
    {
      "scenario": "调试用组件，请勿直接使用。",
      "code": "import React from 'react';\nimport { InputNumber } from 'antd';\n\n/** Test usage. Do not use in your production. */\nconst { _InternalPanelDoNotUseOrYouWillBeFired: InternalInputNumber } = InputNumber;\n\nexport default () => (\n  <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>\n    <InternalInputNumber style={{ width: '100%' }} />\n  </div>\n);\n",
      "title": "\\_InternalPanelDoNotUseOrYouWillBeFired"
    },
    {
      "scenario": "三种大小的数字输入框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `24px` ，默认高度为 `32px`。",
      "code": "import React from 'react';\nimport type { InputNumberProps } from 'antd';\nimport { InputNumber, Space } from 'antd';\n\nconst onChange: InputNumberProps['onChange'] = (value) => {\n  console.log('changed', value);\n};\n\nconst App: React.FC = () => (\n  <Space wrap>\n    <InputNumber size=\"large\" min={1} max={100000} defaultValue={3} onChange={onChange} />\n    <InputNumber min={1} max={100000} defaultValue={3} onChange={onChange} />\n    <InputNumber size=\"small\" min={1} max={100000} defaultValue={3} onChange={onChange} />\n  </Space>\n);\n\nexport default App;\n",
      "title": "三种大小"
    },
    {
      "scenario": "使用 `status` 为 InputNumber 添加状态，可选 `error` 或者 `warning`。",
      "code": "import React from 'react';\nimport ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';\nimport { InputNumber, Space } from 'antd';\n\nconst App: React.FC = () => (\n  <Space direction=\"vertical\" style={{ width: '100%' }}>\n    <InputNumber status=\"error\" style={{ width: '100%' }} />\n    <InputNumber status=\"warning\" style={{ width: '100%' }} />\n    <InputNumber status=\"error\" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />\n    <InputNumber status=\"warning\" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />\n  </Space>\n);\n\nexport default App;\n",
      "title": "自定义状态"
    },
    {
      "scenario": "InputNumber 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。",
      "code": "import React from 'react';\nimport { Flex, InputNumber } from 'antd';\n\nconst App: React.FC = () => (\n  <Flex vertical gap={12}>\n    <InputNumber placeholder=\"Outlined\" style={{ width: 200 }} />\n    <InputNumber placeholder=\"Filled\" variant=\"filled\" style={{ width: 200 }} />\n    <InputNumber placeholder=\"Borderless\" variant=\"borderless\" style={{ width: 200 }} />\n    <InputNumber placeholder=\"Underlined\" variant=\"underlined\" style={{ width: 200 }} />\n  </Flex>\n);\n\nexport default App;\n",
      "title": "形态变体"
    }
  ]
}
```
