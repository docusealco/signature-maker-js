import type SignaturePad from 'signature_pad'

export interface SignatureDetail {
  base64: string | null
  blob: Blob | null
}

export interface SignatureMakerEventMap {
  save: CustomEvent<SignatureDetail>
  change: CustomEvent<SignatureDetail>
}

export interface SignatureMakerElement extends HTMLElement {
  readonly pad: SignaturePad
  readonly canvas: HTMLCanvasElement
  readonly textInput: HTMLInputElement
  readonly fileInput: HTMLInputElement
  readonly saveButton: HTMLButtonElement
  readonly undoButton: HTMLButtonElement
  readonly clearButton: HTMLButtonElement
  readonly isDrawTypeSelected: boolean
  readonly isTextTypeSelected: boolean
  readonly isUploadTypeSelected: boolean
  enableDrawPanel(): void
  enableTextPanel(): void
  enableUploadPanel(): void
  cropCanvas(canvas: HTMLCanvasElement): Promise<Blob>
  addEventListener<K extends keyof SignatureMakerEventMap>(type: K, listener: (this: SignatureMakerElement, event: SignatureMakerEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: SignatureMakerElement, event: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof SignatureMakerEventMap>(type: K, listener: (this: SignatureMakerElement, event: SignatureMakerEventMap[K]) => void, options?: boolean | EventListenerOptions): void
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: SignatureMakerElement, event: HTMLElementEventMap[K]) => void, options?: boolean | EventListenerOptions): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

declare global {
  interface HTMLElementTagNameMap {
    'signature-maker': SignatureMakerElement
  }
}
