import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Flow',
				short_name: 'Flow',
				description: 'Flow - for better financial awareness',
				theme_color: '#213547',
				background_color: '#213547',
				icons: [
					{
						src: 'icon192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: 'icon512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
				display: 'standalone',
				scope: '/',
				start_url: '/',
				orientation: 'portrait',
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				navigateFallbackDenylist: [/^\/api/], // Don't serve index.html for /api routes
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@shared': path.resolve(__dirname, '../shared'),
		},
	},
});
