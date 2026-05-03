import path from 'node:path'
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { generateSW } from 'rollup-plugin-workbox';

declare const caches: {
	open(cacheName: string): Promise<{
		put(request: Request | string, response: Response): Promise<void>;
		match(request: Request | string): Promise<Response | undefined>;
	}>;
};

const CACHE_NAME_AUTH = 'AUTH'
const FAKE_REQUEST_KEY = '/TOKEN'
const PATHNAME_LOGIN = '/signin/login/phone'

export default defineConfig({
	build: {
		outDir: 'build',
	},
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		generateSW({
			globDirectory: './assets',
			globPatterns: ['**/*.{html,js,css}'],
			swDest: './build/sw.js',
			runtimeCaching: [
				{
					urlPattern: /^https:\/\/github\.com\/.+/i,
					handler: 'NetworkOnly',
					method: 'POST',
					options: {
						plugins: [
							{
								handlerWillRespond: function ({ request, response }) {
									if (new URL(request.url).pathname === PATHNAME_LOGIN) {
										return new Promise<Response>(resolve => {
											caches.open(CACHE_NAME_AUTH).then(async cache => {
												try {
													const data = await response.clone().json() as { token: string };
													await cache.put(
														new Request(FAKE_REQUEST_KEY, {
															method: 'GET',
														}),
														new Response(
															JSON.stringify({
																token: data.token,
																timestamp: Date.now(),
															}),
															{
																headers: { 'Content-Type': 'application/json' },
															},
														),
													);
													resolve(response);
												} catch (e) {
													console.error('Cache put error:', e);
												}
											});
										});
									} else {
										return Promise.resolve(response);
									}
								},
								requestWillFetch: function ({ request }) {
									const pathname = new URL(request.url).pathname;
									if (pathname === PATHNAME_LOGIN) {
										return Promise.resolve(request);
									} else {
										return new Promise<Request>(resolve => {
											caches.open(CACHE_NAME_AUTH).then(async cache => {
												const cached = await cache.match(new Request(FAKE_REQUEST_KEY));
												if (cached) {
													const { token } = await cached.json() as { token: string };
													const headers = new Headers(request.headers);
													headers.append('Authorization', `Bearer ${token}`);
													resolve(
														new Request(request, {
															headers,
														}),
													);
												} else {
													resolve(request);
												}
											});
										});
									}
								},
							},
						],
					},
				},
				{
					urlPattern: /^https:\/\/github\.com\/fonts\/.+/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'echo-fonts',
						expiration: {
							maxEntries: 10,
							maxAgeSeconds: 60 * 60 * 24 * 365,
						},
					},
				},
			],
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})