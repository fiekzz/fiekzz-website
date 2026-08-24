import { defineConfig, presetIcons, presetWebFonts } from 'unocss';

export default defineConfig({
	content: {
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
				// include js/ts files
				'src/**/*.{js,ts}'
			]
		}
	},
	// socialLinks.icon comes from the database at request time, so these class
	// names never appear in scanned source files and would otherwise be dropped.
	safelist: [
		'i-carbon-logo-linkedin',
		'i-carbon-logo-x',
		'i-carbon-logo-github',
		'i-carbon-email',
		'i-carbon-logo-facebook',
		'i-carbon-logo-instagram',
		'i-carbon-logo-youtube',
		'i-carbon-logo-discord',
		'i-carbon-logo-tiktok'
	],
	presets: [
		presetWebFonts({
			fonts: {
				sans: {
					name: 'Inter',
					weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
					italic: true,
					provider: 'google'
				}
			}
		}),
		presetIcons({
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle',
				'font-size': '1em'
			}
		})
	]
});
