import path from 'node:path'
import type { Page } from '@playwright/test'

const BUNDLE_PATH = path.resolve(__dirname, '../dist/index.cjs.js')

export async function mount(page: Page, html = '<signature-maker id="sig"></signature-maker>') {
	await page.setContent(`<!doctype html><html><body style="margin: 0; padding: 20px; width: 800px;">${html}</body></html>`)
	await page.evaluate(() => {
		const w = window as any
		w.events = []
		for (const el of document.querySelectorAll('signature-maker')) {
			el.addEventListener('change', (e: Event) => w.events.push({ id: el.id, type: 'change', base64: (e as CustomEvent).detail.base64 }))
			el.addEventListener('save', (e: Event) => w.events.push({ id: el.id, type: 'save', base64: (e as CustomEvent).detail.base64 }))
		}
	})
	await page.addScriptTag({ path: BUNDLE_PATH })
	await page.waitForSelector('#sig canvas')
}

export async function draw(page: Page, selector = '#sig') {
	const box = (await page.locator(`${selector} canvas`).boundingBox())!

	await page.mouse.move(box.x + 50, box.y + 50)
	await page.mouse.down()
	await page.mouse.move(box.x + 150, box.y + 100, { steps: 10 })
	await page.mouse.move(box.x + 250, box.y + 60, { steps: 10 })
	await page.mouse.up()
}

export function events(page: Page) {
	return page.evaluate(() => (window as any).events as { id: string; type: string; base64: string | null }[])
}

export async function lastEvent(page: Page, type: 'change' | 'save', withBase64 = true) {
	await page.waitForFunction(
		([type, withBase64]) => {
			const last = (window as any).events.filter((e: { type: string }) => e.type === type).at(-1)
			return last && (last.base64 !== null) === withBase64
		},
		[type, withBase64] as const,
	)

	return (await events(page)).filter((e) => e.type === type).at(-1)!
}
