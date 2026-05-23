import { clean } from 'semver'
import { kebabCase, camelCase, isEmpty, merge, upperFirst } from 'lodash-es'
import { mdToJsonSchema } from '@ant-design/md-to-json-schema/dist/MarkDown/index.js'
import GITHUB_CONTENT_BASE_URL from '../constants/GITHUB_CONTENT_BASE_URL.ts'
import API_FILE_NAME from '../constants/API_FILE_NAME.ts'
import DEMO_DIR_NAME from '../constants/DEMO_DIR_NAME.ts'
import promiseAllSettled from './promiseAllSettled.ts'

interface GithubContentEntry {
  name: string
  path: string
  content: string
  url: string
  download_url: string
  type: string
}

interface DemoEntry {
  name: string
  url: string
}

interface DemoFile {
  name: string
  content: string
}

interface ApiJsonEntry {
  type: string
  title?: string
  value?: string
  otherProps?: {
    columns?: { title: string }[]
    dataSource?: Record<string, string>[]
  }
}

interface DemoInfo {
  title?: string
  scenario?: string
  code?: string
}

const fetchJson = (url: string) => fetch(url).then((r) => r.json())

const parseMd = (content: string | undefined): ApiJsonEntry[] =>
  isEmpty(content) ? [] : mdToJsonSchema(Buffer.from(content!, 'base64').toString('utf8'))

const parseDefault = (value: string | undefined) => {
  if (!value || value === '-' || value === '' || value === null) return null
  const clean = value.replace(/^`|`$/g, '')
  if (clean === 'true') return true
  if (clean === 'false') return false
  const num = Number(clean)
  if (!Number.isNaN(num) && clean.trim() !== '' && String(num) === clean.trim()) return num
  return clean
}

export default async function fetchComponentDoc(componentName: string, version: string) {
  const normalizedComponentName = kebabCase(componentName)
  const ref = version ? clean(version) : void 0
  const generateContentUrl = (path: string) =>
    `${GITHUB_CONTENT_BASE_URL}${normalizedComponentName}/${path}${ref ? `?ref=${ref}` : ''}`
  const apiMdFileUrl = generateContentUrl(API_FILE_NAME)
  const demoDirUrl = generateContentUrl(DEMO_DIR_NAME)
  const [apiMdFileResult, demoDirResult] = await Promise.allSettled(
    [apiMdFileUrl, demoDirUrl].map((url) => fetchJson(url))
  ) as [PromiseSettledResult<GithubContentEntry>, PromiseSettledResult<GithubContentEntry[]>]
  const validDemoEntries: DemoEntry[] = (demoDirResult.status === 'fulfilled' ? demoDirResult.value : [])?.filter?.(({ name }) => !name?.startsWith('_')) || []
  const demoEntryResults = await promiseAllSettled(
    validDemoEntries.map(({ url }) => () => fetchJson(url)),
    5
  )
  const validDemoFiles = demoEntryResults
    .filter(({ status }) => status === 'fulfilled')
    .map((result) => (result as { status: 'fulfilled'; value: DemoFile }).value)
  const demoMap: Record<string, DemoInfo> = {}
  for (const { name, content } of validDemoFiles) {
    const [demoName, ext] = name?.split('.') || []
    if (!demoName) continue
    if (ext === 'md') {
      const demoJson = parseMd(content)
      merge(demoMap, {
        [demoName]: {
          scenario: demoJson.find(({ title }) => title === 'zh-CN')?.value?.trim()
        }
      })
    } else if (ext === 'tsx') {
      merge(demoMap, {
        [demoName]: {
          code: Buffer.from(content, 'base64').toString('utf8')
        }
      })
    }
  }
  const apiJson = parseMd(apiMdFileResult.status === 'fulfilled' ? apiMdFileResult.value?.content : undefined)
  const tableEntry = apiJson.find(
    ({ type, otherProps }) =>
      type === 'table' &&
      ['参数', '类型'].every((t) => otherProps?.columns?.some(({ title }) => title === t))
  )
  const props = tableEntry?.otherProps?.dataSource?.map((row: Record<string, string>) => ({
    name: (row['参数'] || '').replace(/^~~|~~$/g, ''),
    type: row['类型'] || '',
    required: false as boolean,
    default: parseDefault(row['默认值']),
    description: row['说明'] || ''
  }))
  const findEntry = (predicate: (entry: ApiJsonEntry) => boolean) => apiJson.find(predicate)
  const whenToUseEntry = findEntry(({ title }) => !!title?.startsWith('何时使用'))
  const purpose = whenToUseEntry?.value?.match(/^([^]*?)(?:\n\n|<code)/)?.[1]?.trim()
  const demoTagRe = /<code src="\.\/demo\/([\w-]+)\.tsx"[^>]*>([^<]+)<\/code>/g
  let m: RegExpExecArray | null
  while ((m = demoTagRe.exec(whenToUseEntry?.value || '')) !== null) {
    merge(demoMap, {
      [m[1]!]: {
        title: m[2]
      }
    })
  }
  return JSON.stringify({
    name: normalizedComponentName,
    importName: upperFirst(camelCase(normalizedComponentName)),
    purpose,
    props,
    examples: Object.values(demoMap)
  })
}