<p align="center">
  <a href="https://www.docuseal.com/online-signature" target="_blank">
    <img width="600" height="356" src='https://github.com/user-attachments/assets/305904a9-291f-416d-ac32-baaf22970450' alt='Signature Maker'>
  </a>
</p>

# Signature Maker JS

Web component that lets users draw, type or upload their signature and returns it as a PNG.

[Live demo](https://www.docuseal.com/online-signature) · [Documentation](https://www.docuseal.com/docs/embedded/signature#js) · [React](https://github.com/docusealco/signature-maker-react) · [Vue](https://github.com/docusealco/signature-maker-vue)

## Installation

```bash
npm install @docuseal/signature-maker-js
# or
yarn add @docuseal/signature-maker-js
```

```js
import '@docuseal/signature-maker-js'
```

Importing the package registers the `<signature-maker>` element. The import is safe in server-side rendered apps. Without a bundler, load it from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@docuseal/signature-maker-js@1/dist/index.cjs.js"></script>
```

## Usage

No JavaScript needed: the Submit button downloads the signature as a PNG.

```html
<signature-maker data-download-on-save="true"></signature-maker>
```

Handle the signature when the user clicks Submit:

```html
<signature-maker id="signatureMaker"></signature-maker>

<script>
  signatureMaker.addEventListener('save', (e) => {
    fetch('/save-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: e.detail.base64 }),
    })
  })
</script>
```

Embed in a form without the Submit button. A nested file input receives the PNG on every change:

```html
<form method="POST" action="/submit-form">
  <input name="name" type="text">
  <signature-maker data-with-submit="false">
    <input type="file" name="signature">
  </signature-maker>
  <button type="submit">Submit</button>
</form>
```

Restyle with CSS classes and translate the labels. A full DaisyUI example:

```html
<signature-maker
  class="block my-8"
  data-save-button-text="Télécharger"
  data-undo-button-text="Annuler"
  data-clear-button-text="Clair"
  data-draw-type-button-text="Dessiner"
  data-text-type-button-text="Type"
  data-upload-type-button-text="Télécharger"
  data-text-input-placeholder="Tapez votre signature ici"
  data-type-buttons-container-class="flex gap-2 mb-4 justify-center"
  data-draw-type-button-class="flex items-center justify-center py-3 w-40 uppercase border-neutral-focus space-x-2 border rounded-3xl cursor-pointer hover:bg-neutral hover:text-white hover:font-semibold"
  data-draw-type-button-active-class="bg-neutral text-white font-semibold"
  data-text-type-button-class="flex items-center justify-center py-3 w-40 uppercase border-neutral-focus space-x-2 border rounded-3xl cursor-pointer hover:bg-neutral hover:text-white hover:font-semibold"
  data-text-type-button-active-class="bg-neutral text-white font-semibold"
  data-upload-type-button-class="flex items-center justify-center py-3 w-40 uppercase border-neutral-focus space-x-2 border rounded-3xl cursor-pointer hover:bg-neutral hover:text-white hover:font-semibold"
  data-upload-type-button-active-class="bg-neutral text-white font-semibold"
  data-text-input-class="input mb-4 input-bordered bg-white text-2xl w-full h-14 rounded-2xl"
  data-canvas-class="bg-white border border-base-300 rounded-2xl w-full"
  data-undo-button-class="btn btn-outline btn-sm font-medium"
  data-clear-button-class="btn btn-outline btn-sm font-medium"
  data-save-button-class="btn btn-neutral text-white text-base w-full"
>
</signature-maker>
```

## Events

| Event | When | `e.detail` |
|---|---|---|
| `save` | Submit button clicked | `{ base64, blob }` |
| `change` | Signature drawn, typed, uploaded or cleared | `{ base64, blob }`, both `null` when empty |

The element also exposes `enableDrawPanel()`, `enableTextPanel()`, `enableUploadPanel()` and the underlying [signature_pad](https://github.com/szimek/signature_pad) instance as `pad`. TypeScript declarations are included; the payload type is `SignatureDetail`:

```ts
import type { SignatureDetail } from '@docuseal/signature-maker-js'

el.addEventListener('save', (e: CustomEvent<SignatureDetail>) => console.log(e.detail.base64))
```

## Attributes

Behavior:

| Attribute | Default | Description |
|---|---|---|
| `data-with-drawn` | `true` | Show the Draw tab |
| `data-with-typed` | `true` | Show the Type tab |
| `data-with-upload` | `true` | Show the Upload tab |
| `data-with-color-select` | `true` | Show the pen color picker |
| `data-with-submit` | `true` | Show the Submit button |
| `data-download-on-save` | `false` | Download the PNG on Submit |
| `data-font-url` | Dancing Script | WOFF font used for typed signatures |

Labels: `data-save-button-text`, `data-undo-button-text`, `data-clear-button-text`, `data-draw-type-button-text`, `data-text-type-button-text`, `data-upload-type-button-text`, `data-text-input-placeholder`.

Styles: every element below accepts `data-<element>-class` and `data-<element>-style`. A class replaces the default inline styles, a style overrides them. State variants are appended to the base class or style.

| Element | State variants |
|---|---|
| `save-button` | `disabled-class`, `disabled-style` |
| `draw-type-button`, `text-type-button`, `upload-type-button` | `active-class`, `active-style` |
| `undo-button`, `clear-button`, `text-input`, `canvas`, `type-buttons-container`, `control-buttons-container` | |

Example: `data-draw-type-button-class="tab"` plus `data-draw-type-button-active-class="tab-active"` renders `class="tab tab-active"` while Draw is selected.

## License

MIT
