import { expect, test } from '@playwright/test'
import { draw, mount } from './helpers'

const TARGETS = [
	'controlButtonsContainer',
	'saveButton',
	'undoButton',
	'clearButton',
	'textInput',
	'canvas',
	'typeButtonsContainer',
	'drawTypeButton',
	'textTypeButton',
	'uploadTypeButton',
]

const LABELS = {
	drawTypeButton: 'Draw',
	textTypeButton: 'Type',
	uploadTypeButton: 'Upload',
	undoButton: 'Undo',
	clearButton: 'Clear',
	saveButton: 'Submit',
}

const CANVAS_BASE_STYLE = 'padding: 1px; touch-action: none; user-select: none;'
const DEFAULT_FONT_URL = 'https://cdn.jsdelivr.net/npm/@fontsource/dancing-script/files/dancing-script-latin-400-normal.woff'
const STATEFUL_TARGETS: Record<string, string> = {
	saveButton: 'background-color: #D3D3D3; color: #808080; cursor: not-allowed; border: 0;',
	drawTypeButton: 'color: #fff; background-color: #222222; font-weight: 500;',
	canvas: 'touch-action: none; user-select: none;',
}

let fontBody: Buffer

test.beforeAll(async ({ request }) => {
	fontBody = await (await request.get(DEFAULT_FONT_URL)).body()
})

const kebab = (value: string) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const element = (html: string, attributes: Record<string, string>) =>
	`<signature-maker id="sig" ${Object.entries(attributes)
		.map(([name, value]) => `${name}="${value}"`)
		.join(' ')}>${html}</signature-maker>`

test('every element has default inline styles and labels', async ({ page }) => {
	await mount(page)

	for (const target of TARGETS) {
		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('class', '')
		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('style', /.+/)
	}

	for (const [target, label] of Object.entries(LABELS)) {
		await expect(page.locator(`#sig [data-target="${target}"] span`).last()).toHaveText(label)
	}

	await expect(page.locator('#sig [data-target="textInput"]')).toHaveAttribute('placeholder', 'Type signature here')
})

test('every *-class attribute replaces the default inline style', async ({ page }) => {
	await mount(page, element('', Object.fromEntries(TARGETS.map((target) => [`data-${kebab(target)}-class`, `${target}-cls`]))))

	for (const target of TARGETS) {
		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('class', `${target}-cls`)
		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('style', target === 'canvas' ? CANVAS_BASE_STYLE : '')
	}
})

test('every *-style attribute overrides the default inline style', async ({ page }) => {
	await mount(page, element('', Object.fromEntries(TARGETS.map((target, i) => [`data-${kebab(target)}-style`, `padding: ${i + 1}px;`]))))

	for (const [i, target] of TARGETS.entries()) {
		const stateStyle = STATEFUL_TARGETS[target]

		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('style', stateStyle ? `padding: ${i + 1}px; ${stateStyle}` : `padding: ${i + 1}px;`)
		await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('class', '')
	}
})

test('every *-text attribute and the placeholder are applied', async ({ page }) => {
	await mount(
		page,
		element('', {
			...Object.fromEntries(Object.keys(LABELS).map((target) => [`data-${kebab(target)}-text`, `${target} label`])),
			'data-text-input-placeholder': 'Custom placeholder',
		}),
	)

	for (const target of Object.keys(LABELS)) {
		await expect(page.locator(`#sig [data-target="${target}"] span`).last()).toHaveText(`${target} label`)
	}

	await expect(page.locator('#sig [data-target="textInput"]')).toHaveAttribute('placeholder', 'Custom placeholder')
})

test('type buttons combine base and active class and style for the selected type', async ({ page }) => {
	const buttons = ['drawTypeButton', 'textTypeButton', 'uploadTypeButton']

	await mount(
		page,
		element(
			'',
			Object.fromEntries(
				buttons.flatMap((target) => [
					[`data-${kebab(target)}-class`, `${target}-cls`],
					[`data-${kebab(target)}-active-class`, `${target}-active`],
					[`data-${kebab(target)}-style`, 'color: red;'],
					[`data-${kebab(target)}-active-style`, 'color: blue;'],
				]),
			),
		),
	)

	for (const selected of buttons) {
		await page.locator(`#sig [data-target="${selected}"]`).click()

		for (const target of buttons) {
			const isActive = target === selected

			await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('class', isActive ? `${target}-cls ${target}-active` : `${target}-cls`)
			await expect(page.locator(`#sig [data-target="${target}"]`)).toHaveAttribute('style', isActive ? 'color: red; color: blue;' : 'color: red;')
		}
	}
})

test('type buttons fall back to default active style when only a custom active style is given', async ({ page }) => {
	await mount(page, element('', { 'data-draw-type-button-active-style': 'color: blue;' }))

	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toHaveAttribute('style', /border: 1px solid #222222; color: blue;$/)
	await expect(page.locator('#sig [data-target="textTypeButton"]')).toHaveAttribute('style', /border: 1px solid #222222;$/)
})

test('save button combines base and disabled class and style', async ({ page }) => {
	await mount(
		page,
		element('', {
			'data-save-button-class': 'save-cls',
			'data-save-button-disabled-class': 'save-disabled',
			'data-save-button-style': 'color: red;',
			'data-save-button-disabled-style': 'color: gray;',
		}),
	)

	const save = page.locator('#sig [data-target="saveButton"]')

	await expect(save).toBeDisabled()
	await expect(save).toHaveAttribute('class', 'save-cls save-disabled')
	await expect(save).toHaveAttribute('style', 'color: red; color: gray;')

	await draw(page)

	await expect(save).toBeEnabled()
	await expect(save).toHaveAttribute('class', 'save-cls')
	await expect(save).toHaveAttribute('style', 'color: red;')
})

test('save button uses the default disabled style when no custom style is given', async ({ page }) => {
	await mount(page)

	await expect(page.locator('#sig [data-target="saveButton"]')).toHaveAttribute('style', /background-color: #D3D3D3; color: #808080; cursor: not-allowed; border: 0;$/)

	await draw(page)

	await expect(page.locator('#sig [data-target="saveButton"]')).not.toHaveAttribute('style', /cursor: not-allowed/)
})

for (const [attribute, hiddenTarget, selectedGetter] of [
	['data-with-drawn', 'drawTypeButton', 'isTextTypeSelected'],
	['data-with-typed', 'textTypeButton', 'isDrawTypeSelected'],
	['data-with-upload', 'uploadTypeButton', 'isDrawTypeSelected'],
] as const) {
	test(`${attribute}="false" hides its type button`, async ({ page }) => {
		await mount(page, element('', { [attribute]: 'false' }))

		await expect(page.locator(`#sig [data-target="${hiddenTarget}"]`)).toBeHidden()
		await expect(page.locator('#sig [data-target="typeButtonsContainer"]')).toBeVisible()
		expect(await page.evaluate((getter) => (document.querySelector('signature-maker') as any)[getter], selectedGetter)).toBe(true)
	})
}

test('upload only keeps the type buttons visible so the file dialog can be opened', async ({ page }) => {
	await mount(page, element('', { 'data-with-drawn': 'false', 'data-with-typed': 'false' }))

	await expect(page.locator('#sig [data-target="typeButtonsContainer"]')).toBeVisible()
	await expect(page.locator('#sig [data-target="uploadTypeButton"]')).toBeVisible()
	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="textTypeButton"]')).toBeHidden()
	expect(await page.evaluate(() => (document.querySelector('signature-maker') as any).isUploadTypeSelected)).toBe(true)
})

test('disabling every type logs an error', async ({ page }) => {
	const errors: string[] = []

	page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))

	await mount(page, element('', { 'data-with-drawn': 'false', 'data-with-typed': 'false', 'data-with-upload': 'false' }))

	expect(errors.some((text) => text.includes('At least one of'))).toBe(true)
})

test('data-with-color-select="false" hides the color inputs from the start', async ({ page }) => {
	await mount(page, element('', { 'data-with-color-select': 'false' }))

	await expect(page.locator('#sig [data-target="colorSelect"]')).toBeHidden()

	await page.locator('#sig [data-target="textTypeButton"]').click()
	await expect(page.locator('#sig [data-target="colorSelect"]')).toBeHidden()
})

test('data-download-on-save is off by default', async ({ page }) => {
	await mount(page)
	await draw(page)

	let downloaded = false

	page.on('download', () => (downloaded = true))

	await page.locator('#sig [data-target="saveButton"]').click()
	await page.waitForFunction(() => (window as any).events.some((e: { type: string }) => e.type === 'save'))

	expect(downloaded).toBe(false)
})

test('data-font-url loads the custom font for typed signatures', async ({ page }) => {
	const fontUrl = 'https://fonts.example.com/custom.woff'
	let requested = 0

	await page.route(fontUrl, async (route) => {
		requested++
		await route.fulfill({ status: 200, contentType: 'font/woff', body: fontBody })
	})

	await mount(page, element('', { 'data-font-url': fontUrl }))

	expect(requested).toBe(0)

	await page.locator('#sig [data-target="textTypeButton"]').click()
	await page.waitForFunction(() => document.fonts.check('58px SignatureFont'))

	expect(requested).toBe(1)
})

test('data-font-url change after mount reloads the font', async ({ page }) => {
	const urls: string[] = []

	await page.route('https://fonts.example.com/**', async (route) => {
		urls.push(route.request().url())
		await route.fulfill({ status: 200, contentType: 'font/woff', body: fontBody })
	})

	await mount(page, element('', { 'data-font-url': 'https://fonts.example.com/one.woff' }))
	await page.locator('#sig [data-target="textTypeButton"]').click()
	await page.waitForFunction(() => document.fonts.check('58px SignatureFont'))

	await page.evaluate(() => ((document.querySelector('signature-maker') as HTMLElement).dataset.fontUrl = 'https://fonts.example.com/two.woff'))
	await expect.poll(() => urls.length).toBe(2)
	expect(urls[1]).toBe('https://fonts.example.com/two.woff')
})
