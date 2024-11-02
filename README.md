<p align="center">
  <a href="https://www.docuseal.com/online-signature" target="_blank">
    <img width="600" height="356" src='https://github.com/user-attachments/assets/305904a9-291f-416d-ac32-baaf22970450' alt='Signature Maker'>
  </a>
</p>

# Signature Maker JS

Signature Maker is a web component that lets users draw or type their signature.

#### Other implementations

- [React](https://github.com/docusealco/signature-maker-react)
- [Vue](https://github.com/docusealco/signature-maker-vue)

## Demo

Try the live demo [here](https://www.docuseal.com/online-signature)

## Documentation

Check out the full documentation [here](https://www.docuseal.com/docs/embedded/signature#js).

## Installation

```bash
npm install @docuseal/signature-maker-js
```

OR

```bash
yarn add @docuseal/signature-maker-js
```

OR

```html
<script src="https://cdn.jsdelivr.net/npm/@docuseal/signature-maker-js/dist/index.cjs.min.js"></script>
```

## Usage

Basic Usage with standard styles and default signature saving behavior:

```html
<signature-maker
  id="signatureMaker"
  data-download-on-save="true"
>
</signature-maker>
```

---

Usage with default styles but custom signature saving behavior, such as uploading the signature to a server:

```html
<signature-maker id="signatureMaker"><signature-maker>

<script>
  window.signatureMaker.addEventListener('save', (e) => {
    fetch('/save-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: e.detail.base64 }),
    });
  })
</script>
```

---

Usage without a save signature button, embedded in another form. The signature will be stored in a form field named `signature`:

```html
<form id="myForm" method="POST" action="/submit-form">
  <input name="name" type="text">
  <signature-maker
    id="signatureMaker"
    data-with-submit="false"
  >
    <input type="hidden" type="file" name="signature">
  </signature-maker>
  <button type="submit">Submit</button>
</form>
```

---

Usage without a save signature button and tracking each signature change:

```html
<signature-maker
  id="signatureMaker"
  data-with-submit="false"
>
</signature-maker>
<script>
  window.signatureMaker.addEventListener('change', (e) => {
    if (e.detail.base64) {
      fetch('/background-save-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: e.detail.base64 }),
      });
    } else {
      console.log('No signature to save');
    }
  })
</script>
```

---

Usage with custom button labels and classes (DaisyUI):

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

---

Usage with customization of certain elements using CSS classes and styles:

```html
<signature-maker
  data-save-button-class="btn btn-neutral text-white text-base w-full"
  data-canvas-class="bg-white border border-base-300 rounded-2xl w-full"
  data-canvas-style="border: 2px solid #000;"
>
</signature-maker>
```

## Customization

Signature Maker can be customized with the following attributes:

```
data-download-on-save
data-with-typed
data-with-drawn
data-with-upload
data-with-color-select
data-with-submit
data-save-button-text
data-control-buttons-container-class
data-control-buttons-container-style
data-save-button-class
data-save-button-style
data-save-button-disabled-class
data-save-button-disabled-style
data-undo-button-text
data-undo-button-class
data-undo-button-style
data-clear-button-text
data-clear-button-class
data-clear-button-style
data-text-input-placeholder
data-text-input-class
data-text-input-style
data-canvas-class
data-canvas-style
data-type-buttons-container-class
data-type-buttons-container-style
data-draw-type-button-text
data-draw-type-button-class
data-draw-type-button-style
data-draw-type-button-active-class
data-draw-type-button-active-style
data-text-type-button-text
data-text-type-button-class
data-text-type-button-style
data-text-type-button-active-class
data-text-type-button-active-style
data-upload-type-button-text
data-upload-type-button-class
data-upload-type-button-style
data-upload-type-button-active-class
data-upload-type-button-active-style
data-font-url
````

The full documentation with detailed configuration and event descriptions can be found [here](https://www.docuseal.com/docs/embedded/signature#js).

# License

MIT
