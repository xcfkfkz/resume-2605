import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server'
import { z } from 'zod/v4'
import { VERSION } from 'virtual:env'
import fetchComponentDoc from './utils/fetchComponentDoc.ts'

const server = new McpServer(
  {
    name: 'open-antd-spec',
    version: VERSION
  },
  {
    instructions: `这是一个 Ant-Design 组件服务 MCP Server，提供符合 Open Spec 规范的 antd 用法查询功能。

			核心工具：
			- get-component-doc: 通过组件名称和 antd 版本号查询指定组件的 API 和使用示例。
			
			使用建议：
			- 当用户询问“antd”或“ant-design”并提及组件名称时，请先查询用户安装的 antd 的版本号，再调用本工具，否则可能会导致结果不准确。
		`
  }
)

server.registerTool(
  'get-component-doc',
  {
    title: '查询指定 antd 组件用法',
    description:
      '列出指定 antd 组件的 API、使用场景、代码示例等，注意：调用前务必使用 `npm ls antd --depth=0` 等方式获取用户实际安装的 antd 具体版本，再将获得的版本号传给本工具',
    inputSchema: z.object({
      name: z.string().describe('`user prompt` 中提及的 antd 组件名称'),
      version: z.string().describe('antd 版本号')
    })
  },
  async ({ name, version }) => {
    return {
      content: [
        {
          type: 'text',
          text: await fetchComponentDoc(name, version)
        }
      ]
    }
  }
)

await server.connect(new StdioServerTransport())
