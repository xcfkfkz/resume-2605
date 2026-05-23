import { defineConfig } from 'rolldown';
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
	input: 'src/main.ts',
	platform: 'node',
	treeshake: {
		annotations: true,
		moduleSideEffects: false
	},
	output: {
		format: 'esm',
		file: 'dist/index.js',
		banner: '#!/usr/bin/env node\n',
		minify: true
	},
	plugins: [
		{
			name: 'virtual-env',
			resolveId(id) {
				if (id === 'virtual:env') {
					return '\0virtual:env'
				}
				return null
			},
			load(id) {
				if (id === '\0virtual:env') {
					return `export const VERSION = "${pkg.version}";`
				}
				return null
			}
		}
	]
})