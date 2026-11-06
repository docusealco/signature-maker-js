import { expect, test } from '@playwright/test'
import { draw, events, lastEvent, mount } from './helpers'

const PNG_BASE64_PREFIX = 'iVBORw0KGgo'

test('can be imported outside the browser', async () => {
	await expect(import('../dist/index.esm.js')).resolves.toBeTruthy()
	expect(() => require('../dist/index.cjs.js')).not.toThrow()
})

test('cjs bundle works as a classic script and registers the element', async ({ page }) => {
	await mount(page)

	expect(await page.evaluate(() => typeof customElements.get('signature-maker'))).toBe('function')
})

test('renders defaults in draw mode', async ({ page }) => {
	await mount(page)

	await expect(page.locator('#sig [data-target="drawTypeButton"] span')).toHaveText('Draw')
	await expect(page.locator('#sig [data-target="saveButton"]')).toHaveText('Submit')
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeDisabled()
	await expect(page.locator('#sig [data-target="textInput"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="undoButton"]')).toBeVisible()
	await expect(page.locator('#sig [data-target="saveButton"]')).toHaveAttribute('style', /font-size: 16px/)
	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toHaveAttribute('style', /background-color: #222222/)
	await expect(page.locator('#sig [data-target="textTypeButton"]')).toHaveAttribute('style', /background-color: transparent/)

	const initial = await events(page)
	expect(initial.length).toBeGreaterThan(0)
	expect(initial.every((e) => e.type === 'change' && e.base64 === null)).toBe(true)
})

test('drawing emits change, enables submit and emits save with a PNG', async ({ page }) => {
	await mount(page, '<signature-maker id="sig" data-download-on-save="true"></signature-maker>')
	await draw(page)

	const change = await lastEvent(page, 'change')
	expect(change.base64).toMatch(new RegExp(`^${PNG_BASE64_PREFIX}`))
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeEnabled()

	const downloadPromise = page.waitForEvent('download')
	await page.locator('#sig [data-target="saveButton"]').click()

	const save = await lastEvent(page, 'save')
	expect(save.base64).toMatch(new RegExp(`^${PNG_BASE64_PREFIX}`))
	expect((await downloadPromise).suggestedFilename()).toMatch(/^signature-\d+\.png$/)
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeEnabled()
})

test('undo and clear reset the drawing', async ({ page }) => {
	await mount(page)
	await draw(page)
	await draw(page)

	await page.locator('#sig [data-target="undoButton"]').click()
	expect((await lastEvent(page, 'change')).base64).not.toBeNull()
	expect(await page.evaluate(() => (document.querySelector('signature-maker') as any).pad.toData().length)).toBe(1)

	await page.locator('#sig [data-target="clearButton"]').click()
	expect((await events(page)).at(-1)!.base64).toBeNull()
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeDisabled()
})

test('typed signature is drawn on the canvas and emits change', async ({ page }) => {
	await mount(page)
	await page.locator('#sig [data-target="textTypeButton"]').click()

	await expect(page.locator('#sig [data-target="textInput"]')).toBeVisible()
	await expect(page.locator('#sig [data-target="undoButton"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="textTypeButton"]')).toHaveAttribute('style', /background-color: #222222/)

	await page.locator('#sig [data-target="textInput"]').fill('John Doe')
	expect((await lastEvent(page, 'change')).base64).toMatch(new RegExp(`^${PNG_BASE64_PREFIX}`))

	await page.locator('#sig [data-target="drawTypeButton"]').click()
	expect((await events(page)).at(-1)!.base64).toBeNull()
	await expect(page.locator('#sig [data-target="textInput"]')).toBeHidden()
})

test('uploaded image is drawn on the canvas', async ({ page }) => {
	await mount(page)
	await page.locator('#sig [data-target="uploadTypeButton"]').click()
	await expect(page.locator('#sig [data-target="colorSelect"]')).toBeHidden()

	const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
	await page.locator('#sig [data-target="fileInput"]').setInputFiles({ name: 'sig.png', mimeType: 'image/png', buffer: png })

	expect((await lastEvent(page, 'change')).base64).toMatch(new RegExp(`^${PNG_BASE64_PREFIX}`))
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeEnabled()
})

test('fills a nested file input', async ({ page }) => {
	await mount(page, '<form><signature-maker id="sig" data-with-submit="false"><input type="file" name="signature"></signature-maker></form>')

	await expect(page.locator('#sig [data-target="saveButton"]')).toBeHidden()
	await draw(page)
	await lastEvent(page, 'change')

	const file = await page.evaluate(() => {
		const input = document.querySelector<HTMLInputElement>('input[name="signature"]')!
		return { count: input.files!.length, name: input.files![0]?.name, type: input.files![0]?.type }
	})
	expect(file.count).toBe(1)
	expect(file.name).toMatch(/^signature-\d+\.png$/)
	expect(file.type).toBe('image/png')

	await page.locator('#sig [data-target="clearButton"]').click()
	expect(await page.evaluate(() => document.querySelector<HTMLInputElement>('input[name="signature"]')!.files!.length)).toBe(0)
})

test('custom labels, classes and styles are applied', async ({ page }) => {
	await mount(page, `
		<signature-maker id="sig"
			data-save-button-text="Sign"
			data-save-button-class="btn"
			data-save-button-disabled-class="btn-disabled"
			data-text-type-button-style="color: red;"
			data-text-type-button-active-style="color: blue;"
			data-draw-type-button-class="tab"
			data-draw-type-button-active-class="tab-active"
			data-canvas-class="cnv"
			data-text-input-placeholder="Your name"
		></signature-maker>
	`)

	const save = page.locator('#sig [data-target="saveButton"]')
	await expect(save).toHaveText('Sign')
	await expect(save).toHaveAttribute('class', 'btn btn-disabled')
	await expect(save).toHaveAttribute('style', '')

	await expect(page.locator('#sig [data-target="textTypeButton"]')).toHaveAttribute('style', 'color: red;')
	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toHaveAttribute('class', 'tab tab-active')
	await expect(page.locator('#sig [data-target="canvas"]')).toHaveAttribute('class', 'cnv')
	await expect(page.locator('#sig [data-target="canvas"]')).toHaveAttribute('style', 'padding: 1px; touch-action: none; user-select: none;')
	await expect(page.locator('#sig [data-target="textInput"]')).toHaveAttribute('placeholder', 'Your name')

	await page.locator('#sig [data-target="textTypeButton"]').click()
	await expect(page.locator('#sig [data-target="textTypeButton"]')).toHaveAttribute('style', 'color: red; color: blue;')
	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toHaveAttribute('class', 'tab')

	await draw(page)
	await page.locator('#sig [data-target="drawTypeButton"]').click()
	await draw(page)
	await expect(save).toHaveAttribute('class', 'btn')
})

test('attributes changed after mount are re-applied', async ({ page }) => {
	await mount(page)

	await page.evaluate(() => {
		const el = document.querySelector('signature-maker')!
		el.dataset.saveButtonText = 'Done'
		el.dataset.withColorSelect = 'false'
		el.dataset.withDrawn = 'false'
	})

	await expect(page.locator('#sig [data-target="saveButton"]')).toHaveText('Done')
	await expect(page.locator('#sig [data-target="colorSelect"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="drawTypeButton"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="textInput"]')).toBeVisible()
})

test('type buttons are hidden when only one type is enabled', async ({ page }) => {
	await mount(page, '<signature-maker id="sig" data-with-drawn="false" data-with-upload="false"></signature-maker>')

	await expect(page.locator('#sig [data-target="typeButtonsContainer"]')).toBeHidden()
	await expect(page.locator('#sig [data-target="textInput"]')).toBeVisible()
	expect(await page.evaluate(() => (document.querySelector('signature-maker') as any).isTextTypeSelected)).toBe(true)
})

test('multiple instances keep independent color and type groups', async ({ page }) => {
	await mount(page, '<signature-maker id="sig"></signature-maker><signature-maker id="sig2"></signature-maker>')

	await page.locator('#sig2 [data-target="colorInput"][value="#EF4444"]').check()
	await page.locator('#sig2 [data-target="textTypeButton"]').click()

	expect(await page.evaluate(() => (document.querySelector('#sig') as any).isDrawTypeSelected)).toBe(true)
	expect(await page.evaluate(() => (document.querySelector('#sig2') as any).isTextTypeSelected)).toBe(true)

	await expect(page.locator('#sig [data-target="colorInput"][value="#000000"]')).toBeChecked()
	await expect(page.locator('#sig2 [data-target="colorInput"][value="#EF4444"]')).toBeChecked()
	expect(await page.evaluate(() => (document.querySelector('#sig2') as any).pad.penColor)).toBe('#EF4444')
})

test('survives being detached and re-attached', async ({ page }) => {
	await mount(page)
	await draw(page)

	await page.evaluate(() => {
		const el = document.querySelector('signature-maker')!
		const parent = el.parentElement!
		el.remove()
		parent.appendChild(el)
	})

	await expect(page.locator('#sig canvas')).toHaveCount(1)
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeDisabled()
	await draw(page)
	await expect(page.locator('#sig [data-target="saveButton"]')).toBeEnabled()
})
