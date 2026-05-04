import path from 'node:path'
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import inlineWebWorkerPlugin from './plugins/inlineWebWorkerPlugin.ts';

export default defineConfig({
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		inlineWebWorkerPlugin()
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})