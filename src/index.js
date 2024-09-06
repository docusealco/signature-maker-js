import SignaturePad from "signature_pad"

class SignatureMarker extends HTMLElement {
  static DEFAULT_STYLES = {
    controlButtonsContainer: 'display: flex; align-items: center; justify-content: space-between; text-align: center; margin: 1rem 0;',
    saveButton: 'color: #ffffff; font-family: ui-sans-serif, system-ui, sans-serif font-size: 16px; font-weight: 600; line-height: 24px; padding: 0px 16px; text-transform: uppercase; background-color: #222222; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 48px; justify-content: center; outline-color: #222222; text-align: center; text-decoration-line: none; width: 100%; border: 1px solid #222222;',
    saveButtonDisabled: 'background-color: #D3D3D3; color: #808080; cursor: not-allowed; border: 0;',
    undoButton: 'color: #222222; background-color: transparent; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-weight: 500; line-height: 14px; padding: 0px 12px; text-transform: uppercase; appearance: button; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 32px; justify-content: center; outline-color: #222222; text-align: center; border: 1px solid #222222;',
    clearButton: 'color: #222222; background-color: transparent; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-weight: 500; line-height: 14px; padding: 0px 12px; text-transform: uppercase; appearance: button; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 32px; justify-content: center; outline-color: #222222; text-align: center; border: 1px solid #222222;',
    canvas: 'display: block; vertical-align: middle; width: 100%; border-radius: 8px; background-color: #ffffff; padding: 1px; touch-action: none; user-select: none; text-align: center; line-height: 24px; border: 1px solid #D3D3D3;',
    textInput: 'color: #222222; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 24px; font-weight: 400; line-height: 32px; margin: 0px 0px 16px; padding: 0px 16px; background-color: #ffffff; border-radius: 8px; flex-shrink: 1; height: 56px; outline: #222222 none 0px; outline-offset: 0px; width: 100%; text-align: start; border: 1px solid #D3D3D3;',
    typeButtonsContainer: 'margin-bottom: 1rem; display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem;',
    drawTypeButton: 'color: #222222; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-weight: 500; line-height: 24px; padding: 0px 40px; text-transform: uppercase; background-color: transparent; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 48px; justify-content: center; outline-color: #222222; text-align: center; border: 1px solid #222222;',
    drawTypeButtonActive: 'color: #fff; background-color: #222222; font-weight: 500;',
    textTypeButton: 'color: #222222; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-weight: 500; line-height: 24px; padding: 0px 40px; text-transform: uppercase; background-color: transparent; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 48px; justify-content: center; outline-color: #222222; text-align: center; border: 1px solid #222222;',
    textTypeButtonActive: 'color: #fff; background-color: #222222; font-weight: 500;',
    uploadTypeButton: 'color: #222222; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-weight: 500; line-height: 24px; padding: 0px 40px; text-transform: uppercase; background-color: transparent; cursor: pointer; align-items: center; border-radius: 8px; gap: 8px; display: inline-flex; flex-shrink: 0; flex-wrap: wrap; height: 48px; justify-content: center; outline-color: #222222; text-align: center; border: 1px solid #222222;',
    uploadTypeButtonActive: 'color: #fff; background-color: #222222; font-weight: 500;',
  }

  static DEFAULT_LABELS = {
    drawTypeButton: 'Draw',
    textTypeButton: 'Type',
    uploadTypeButton: 'Upload',
    undoButton: 'Undo',
    clearButton: 'Clear',
    saveButton: 'Submit',
    textInputPlaceholder: 'Type signature here',
  }

  constructor() {
    super()
    this.isMounted = false
  }

  static observedAttributes = [
    'data-download-on-save',
    'data-with-typed',
    'data-with-drawn',
    'data-with-upload',
    'data-with-color-select',
    'data-with-submit',
    'data-control-buttons-container-class',
    'data-control-buttons-container-style',
    'data-save-button-text',
    'data-save-button-class',
    'data-save-button-style',
    'data-save-button-disabled-class',
    'data-save-button-disabled-style',
    'data-undo-button-text',
    'data-undo-button-class',
    'data-undo-button-style',
    'data-clear-button-text',
    'data-clear-button-class',
    'data-clear-button-style',
    'data-text-input-placeholder',
    'data-text-input-class',
    'data-text-input-style',
    'data-canvas-class',
    'data-canvas-style',
    'data-type-buttons-container-class',
    'data-type-buttons-container-style',
    'data-draw-type-button-text',
    'data-draw-type-button-class',
    'data-draw-type-button-style',
    'data-draw-type-button-active-class',
    'data-draw-type-button-active-style',
    'data-text-type-button-text',
    'data-text-type-button-class',
    'data-text-type-button-style',
    'data-text-type-button-active-class',
    'data-text-type-button-active-style',
    'data-upload-type-button-text',
    'data-upload-type-button-class',
    'data-upload-type-button-style',
    'data-upload-type-button-active-class',
    'data-upload-type-button-active-style',
  ]

  get defaultStyles() {
    return this.constructor.DEFAULT_STYLES
  }

  get defaultLabels() {
    return this.constructor.DEFAULT_LABELS
  }

  get clearButton() {
    return this.querySelector('[data-target="clearButton"]')
  }

  get undoButton() {
    return this.querySelector('[data-target="undoButton"]')
  }

  get controlButtonsContainer() {
    return this.querySelector('[data-target="controlButtonsContainer"]')
  }

  get typeButtonsContainer() {
    return this.querySelector('[data-target="typeButtonsContainer"]')
  }

  get drawTypeButton() {
    return this.querySelector('[data-target="drawTypeButton"]')
  }

  get textTypeButton() {
    return this.querySelector('[data-target="textTypeButton"]')
  }

  get uploadTypeButton() {
    return this.querySelector('[data-target="uploadTypeButton"]')
  }

  get textInput() {
    return this.querySelector('[data-target="textInput"]')
  }

  get fileInput() {
    return this.querySelector('[data-target="fileInput"]')
  }

  get saveButton() {
    return this.querySelector('[data-target="saveButton"]')
  }

  get canvas() {
    return this.querySelector('[data-target="canvas"]')
  }

  get colorSelect() {
    return this.querySelector('[data-target="colorSelect"]')
  }

  get colorInputs() {
    return [...this.querySelectorAll('[data-target="colorInput"]')]
  }

  get setters() {
    return {
      'data-with-typed': this.setDisplayType,
      'data-with-drawn': this.setDisplayType,
      'data-with-upload': this.setDisplayType,
      'data-with-color-select': this.setDisplayColorSelect,
      'data-with-submit': this.setDisplaySubmit,
      'data-control-buttons-container-class': this.setControlButtonsContainerClassAndStyle,
      'data-control-buttons-container-style': this.setControlButtonsContainerClassAndStyle,
      'data-save-button-text': this.setSaveButtonText,
      'data-save-button-class': this.setSaveButtonClassAndStyle,
      'data-save-button-style': this.setSaveButtonClassAndStyle,
      'data-save-button-disabled-class': this.setSaveButtonClassAndStyle,
      'data-save-button-disabled-style': this.setSaveButtonClassAndStyle,
      'data-undo-button-text': this.setUndoButtonText,
      'data-undo-button-class': this.setUndoButtonClassAndStyle,
      'data-undo-button-style': this.setUndoButtonClassAndStyle,
      'data-clear-button-text': this.setCleaButtonText,
      'data-clear-button-class': this.setClearButtonClassAndStyle,
      'data-clear-button-style': this.setClearButtonClassAndStyle,
      'data-canvas-class': this.setCanvasClassAndStyle,
      'data-canvas-style': this.setCanvasClassAndStyle,
      'data-text-input-placeholder': this.setTextInputPlaceholder,
      'data-text-input-class': this.setTextInputClassAndStyle,
      'data-text-input-style': this.setTextInputClassAndStyle,
      'data-type-buttons-container-class': this.setTypeButtonsContainerClassAndStyle,
      'data-type-buttons-container-style': this.setTypeButtonsContainerClassAndStyle,
      'data-draw-type-button-text': this.setDrawTypeButtonText,
      'data-draw-type-button-class': this.setDrawTypeButtonClassAndStyle,
      'data-draw-type-button-style': this.setDrawTypeButtonClassAndStyle,
      'data-draw-type-button-active-class': this.setDrawTypeButtonClassAndStyle,
      'data-draw-type-button-active-style': this.setDrawTypeButtonClassAndStyle,
      'data-text-type-button-text': this.setTextTypeButtonText,
      'data-text-type-button-class': this.setTextTypeButtonClassAndStyle,
      'data-text-type-button-style': this.setTextTypeButtonClassAndStyle,
      'data-text-type-button-active-class': this.setTextTypeButtonClassAndStyle,
      'data-text-type-button-active-style': this.setTextTypeButtonClassAndStyle,
      'data-upload-type-button-text': this.setUploadTypeButtonText,
      'data-upload-type-button-class': this.setUploadTypeButtonClassAndStyle,
      'data-upload-type-button-style': this.setUploadTypeButtonClassAndStyle,
      'data-upload-type-button-active-class': this.setUploadTypeButtonClassAndStyle,
      'data-upload-type-button-active-style': this.setUploadTypeButtonClassAndStyle,
    }
  }

  get isDrawTypeSelected() {
    return this.drawTypeButton.querySelector('input').checked
  }

  get isTextTypeSelected() {
    return this.textTypeButton.querySelector('input').checked
  }

  get isUploadTypeSelected() {
    return this.uploadTypeButton.querySelector('input').checked
  }

  get isSaveButtonDisabled() {
    return this.saveButton.disabled
  }

  get isDownloadOnSaveSettingEnabled() {
    return this.dataset.downloadOnSave === 'true' ? true : false
  }

  get isColorSelectSettingEnabled() {
    return this.dataset.withColorSelect === 'false' ? false : true
  }

  get isSubmitButtonSettingEnabled() {
    return this.dataset.withSubmit === 'false' ? false : true
  }

  setDisplayType = () => {
    const disabledTypeAttibuteValues = [this.dataset.withDrawn, this.dataset.withTyped, this.dataset.withUpload].filter(v => v === 'false')

    this.textTypeButton.parentNode.style.display = this.dataset.withTyped === 'false' ? 'none' : 'inherit'
    this.drawTypeButton.parentNode.style.display = this.dataset.withDrawn === 'false' ? 'none' : 'inherit'
    this.uploadTypeButton.parentNode.style.display = this.dataset.withUpload === 'false' ? 'none' : 'inherit'
    this.typeButtonsContainer.parentNode.style.display = disabledTypeAttibuteValues.length > 1 && this.dataset.withUpload === 'false' ? 'none' : 'inherit'

    if (disabledTypeAttibuteValues.length === 3) {
      console.error('At least one of the "with-typed", "with-drawn", or "with-upload" attributes must be set to "true".')
    } else if (this.dataset.withDrawn !== 'false') {
      this.enableDrawPanel()
    } else if (this.dataset.withTyped !== 'false') {
      this.enableTextPanel()
    } else if (this.dataset.withUpload !== 'false') {
      this.enableUploadPanel()
    }
  }

  setDisplayColorSelect = () => {
    this.colorSelect.style.visibility = this.dataset.withColorSelect === 'false' ? 'hidden' : 'visible'
  }

  setDisplaySubmit = () => {
    this.saveButton.parentNode.style.display = this.dataset.withSubmit === 'false' ? 'none' : 'inherit'
  }

  setControlButtonsContainerClassAndStyle = () => {
    let containerClass = this.dataset.controlButtonsContainerClass || ''
    let containerStyle = this.dataset.controlButtonsContainerStyle || (containerClass ? '' : this.defaultStyles.controlButtonsContainer)

    this.controlButtonsContainer.setAttribute('style', containerStyle)
    this.controlButtonsContainer.setAttribute('class', containerClass)
  }

  setSaveButtonText = () => {
    const textTag = this.saveButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.saveButtonText || this.defaultLabels.saveButton
  }

  setSaveButtonClassAndStyle = () => {
    let buttonClass = this.dataset.saveButtonClass || ''
    let buttonStyle = this.dataset.saveButtonStyle || (buttonClass ? '' : this.defaultStyles.saveButton)

    if (this.isSaveButtonDisabled) {
      if (buttonClass && this.dataset.saveButtonDisabledClass) {
        buttonClass = this.combineStrings(buttonClass, this.dataset.saveButtonDisabledClass)
      }

      if (buttonStyle && this.dataset.saveButtonDisabledStyle) {
        buttonStyle = this.combineStrings(buttonStyle, this.dataset.saveButtonDisabledStyle)
      } else if (!buttonClass) {
        buttonStyle = this.combineStrings(buttonStyle, this.defaultStyles.saveButtonDisabled)
      }
    }

    this.saveButton.setAttribute('class', buttonClass)
    this.saveButton.setAttribute('style', buttonStyle)
  }

  setUndoButtonText = () => {
    const textTag = this.undoButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.undoButtonText || this.defaultLabels.undoButton
  }

  setUndoButtonClassAndStyle = () => {
    let buttonClass = this.dataset.undoButtonClass || ''
    let buttonStyle = this.dataset.undoButtonStyle || (buttonClass ? '' : this.defaultStyles.undoButton)

    this.undoButton.setAttribute('class', buttonClass)
    this.undoButton.setAttribute('style', buttonStyle)
  }

  setCleaButtonText = () => {
    const textTag = this.clearButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.clearButtonText || this.defaultLabels.clearButton
  }

  setClearButtonClassAndStyle = () => {
    let buttonClass = this.dataset.clearButtonClass || ''
    let buttonStyle = this.dataset.clearButtonStyle || (buttonClass ? '' : this.defaultStyles.clearButton)

    this.clearButton.setAttribute('class', buttonClass)
    this.clearButton.setAttribute('style', buttonStyle)
  }

  setCanvasClassAndStyle = () => {
    let canvasClass = this.dataset.canvasClass || ''
    let canvasStyle =  this.dataset.canvasStyle || (canvasClass ? 'padding: 1px; touch-action: none; user-select: none;' : this.defaultStyles.canvas)

    this.canvas.setAttribute('class', canvasClass)
    this.canvas.setAttribute('style', canvasStyle)
 }

  setTypeButtonsContainerClassAndStyle = () => {
    let containerClass = this.dataset.typeButtonsContainerClass || ''
    let containerStyle = this.dataset.typeButtonsContainerStyle || (containerClass ? '' : this.defaultStyles.typeButtonsContainer)

    this.typeButtonsContainer.setAttribute('style', containerStyle)
    this.typeButtonsContainer.setAttribute('class', containerClass)
  }

  setTextInputPlaceholder = () => {
    this.textInput.setAttribute('placeholder', this.dataset.textInputPlaceholder || this.defaultLabels.textInputPlaceholder)
  }

  setTextInputClassAndStyle = () => {
    let inputClass = this.dataset.textInputClass || ''
    let inputStyle = this.dataset.textInputStyle || (inputClass ? '' : this.defaultStyles.textInput)

    this.textInput.setAttribute('class', inputClass)
    this.textInput.setAttribute('style', inputStyle)
  }

  setDrawTypeButtonText = () => {
    const textTag = this.drawTypeButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.drawTypeButtonText || this.defaultLabels.drawTypeButton
  }

  setDrawTypeButtonClassAndStyle = () => {
    let buttonClass = this.dataset.drawTypeButtonClass || ''
    let buttonStyle = this.dataset.drawTypeButtonStyle || (buttonClass ? '' : this.defaultStyles.drawTypeButton)

    if (this.isDrawTypeSelected) {
      if (buttonClass && this.dataset.drawTypeButtonActiveClass) {
        buttonClass = this.combineStrings(buttonClass, this.dataset.drawTypeButtonActiveClass)
      }

      if (buttonStyle && this.dataset.drawTypeButtonActiveStyle) {
        buttonStyle = this.combineStrings(buttonStyle, this.dataset.drawTypeButtonActiveStyle)
      } else if (!buttonClass) {
        buttonStyle = this.combineStrings(buttonStyle, this.defaultStyles.drawTypeButtonActive)
      }
    }

    this.drawTypeButton.setAttribute('class', buttonClass)
    this.drawTypeButton.setAttribute('style', buttonStyle)
  }

  setTextTypeButtonText = () => {
    const textTag = this.textTypeButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.textTypeButtonText || this.defaultLabels.textTypeButton
  }

  setTextTypeButtonClassAndStyle = () => {
    let buttonClass = this.dataset.textTypeButtonClass || ''
    let buttonStyle = this.dataset.textTypeButtonStyle || buttonClass ? '' : this.defaultStyles.textTypeButton

    if (this.isTextTypeSelected) {
      if (buttonClass && this.dataset.textTypeButtonActiveClass) {
        buttonClass = this.combineStrings(buttonClass, this.dataset.textTypeButtonActiveClass)
      }

      if (buttonStyle && this.dataset.textTypeButtonActiveStyle) {
        buttonStyle = this.combineStrings(buttonStyle, this.dataset.textTypeButtonActiveStyle)
      } else if (!buttonClass) {
        buttonStyle = this.combineStrings(buttonStyle, this.defaultStyles.textTypeButtonActive)
      }
    }

    this.textTypeButton.setAttribute('class', buttonClass)
    this.textTypeButton.setAttribute('style', buttonStyle)
  }

  setUploadTypeButtonText = () => {
    const textTag = this.uploadTypeButton.querySelector('span')

    if (textTag) textTag.innerText = this.dataset.uploadTypeButtonText || this.defaultLabels.uploadTypeButton
  }

  setUploadTypeButtonClassAndStyle = () => {
    let buttonClass = this.dataset.uploadTypeButtonClass || ''
    let buttonStyle = this.dataset.uploadTypeButtonStyle || buttonClass ? '' : this.defaultStyles.uploadTypeButton

    if (this.isUploadTypeSelected) {
      if (buttonClass && this.dataset.uploadTypeButtonActiveClass) {
        buttonClass = this.combineStrings(buttonClass, this.dataset.uploadTypeButtonActiveClass)
      }

      if (buttonStyle && this.dataset.uploadTypeButtonActiveStyle) {
        buttonStyle = this.combineStrings(buttonStyle, this.dataset.uploadTypeButtonActiveStyle)
      } else if (!buttonClass) {
        buttonStyle = this.combineStrings(buttonStyle, this.defaultStyles.uploadTypeButtonActive)
      }
    }

    this.uploadTypeButton.setAttribute('class', buttonClass)
    this.uploadTypeButton.setAttribute('style', buttonStyle)
  }

  combineStrings(str1, str2) {
    return [str1, str2].filter(Boolean).join(' ')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isMounted) return

    if (this.setters[name] && oldValue !== newValue) {
      this.setters[name]()
    }
  }

  connectedCallback() {
    if (document.readyState !== "complete") {
      document.addEventListener('DOMContentLoaded', () => this.init())
    } else {
      this.init()
    }
  }

  init () {
    this.style.display = 'block'

    this.childrenNode = document.createElement('div')
    this.appendChild(this.childrenNode)

    Array.from(this.childNodes).map((node) => {
      this.childrenNode !== node && this.childrenNode.appendChild(node)
    })

    this.childrenNode.style.display = 'none'

    this.fieldNode = document.createElement('div')
    this.fieldNode.innerHTML = this.tempalte

    this.appendChild(this.fieldNode)

    this.pad = new SignaturePad(this.canvas)
    this.isMounted = true

    for (const key in this.setters) {
      if (this.setters.hasOwnProperty(key)) {
        this.setters[key]()
      }
    }

    this.scale = 2
    this.isFontLoaded = false

    this.canvas.width = this.canvas.parentNode.parentNode.clientWidth
    this.canvas.height = this.canvas.parentNode.parentNode.clientWidth / this.scale

    if (this.dataset.withDrawn !== 'false') {
      this.enableDrawPanel()
    } else if (this.dataset.withTyped !== 'false') {
      this.enableTextPanel()
    } else if (this.dataset.withUpload !== 'false') {
      this.enableUploadPanel()
    } else {
      this.enableDrawPanel()
    }

    this.pad.addEventListener('endStroke', () => {
      this.handleDownloadState()
    })

    this.clearButton.addEventListener('click', (e) => {
      e.preventDefault()

      this.cleaSignaturePad()
      this.clearTextInput()
    })

    this.undoButton.addEventListener('click', (e) => {
      e.preventDefault()

      const data = this.pad.toData()

      if (data) {
        data.pop()
        this.pad.fromData(data)
        this.handleDownloadState()
      }
    })

    this.drawTypeButton.addEventListener('click', (e) => {
      e.preventDefault()

      this.enableDrawPanel()
    })


    this.textTypeButton.addEventListener('click', (e) => {
      e.preventDefault()

      this.enableTextPanel()
    })

    this.uploadTypeButton.addEventListener('click', () => {
      this.uploadTypeButton.querySelector('input[type="radio"]').checked = true
      this.enableUploadPanel()
    })

    this.fileInput.addEventListener('change', (e) => {
      this.drawOnCanvas(e.target.files[0]).then(() => {
        this.handleDownloadState()
      }).catch((error) => {
        alert(error.message)
      })
    })

    this.colorInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        if (this.textInput.value !== '') {
          this.canvas.getContext('2d').fillStyle = e.target.value
          this.drawText()
        }

        this.pad.penColor = e.target.value
      })
    })

    this.textInput.addEventListener('input', () => {
      this.drawText()

      this.handleDownloadState()
    })

    this.saveButton.addEventListener('click', (e) => {
      e.preventDefault()

      this.disableSaveButton()

      this.cropCanvas(this.canvas).then((blob) => {
        if (this.isDownloadOnSaveSettingEnabled) {
          this.downloadBlob(blob, `signature-${Date.now()}.png`)
        }

        this.convertBlobToBase64(blob).then((base64String) => {
          this.dispatchEvent(new CustomEvent('save', { detail: { base64: base64String, blob } }))
        }).catch((error) => {
          console.error('Failed to convert blob to base64:', error)
        })
      }).then(() => {
        this.enableSaveButton()
      }).catch((error) => {
        console.error('Download failed:', error)
        this.disableSaveButton()
      })
    })

    this.intersectionObserver = new IntersectionObserver(
      (entries, _observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.canvas.width = this.canvas.parentNode.clientWidth * this.scale
            this.canvas.height = (this.canvas.parentNode.clientWidth * this.scale) / 3

            this.canvas.getContext('2d').scale(this.scale, this.scale)

            this.intersectionObserver?.disconnect()
          }
        })
      },
    )

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width
        const isMobile = width < 576

        this.drawTypeButton.getElementsByTagName('span')[0].style.display = isMobile ? 'none' : 'inline-block'
        this.textTypeButton.getElementsByTagName('span')[0].style.display = isMobile ? 'none' : 'inline-block'
        this.uploadTypeButton.getElementsByTagName('span')[0].style.display = isMobile ? 'none' : 'inline-block'
      }
    })

    this.resizeObserver.observe(this)
    this.intersectionObserver.observe(this.canvas)
  }

  enableDrawPanel() {
    this.drawTypeButton.querySelector('input').checked = true
    this.textTypeButton.querySelector('input').checked = false
    this.uploadTypeButton.querySelector('input').checked = false
    this.textInput.parentNode.style.display = 'none'
    this.undoButton.parentNode.style.display = 'inline-block'
    this.pad.on()
    if (this.isColorSelectSettingEnabled) this.colorSelect.style.visibility = 'visible'

    this.setTextTypeButtonClassAndStyle()
    this.setDrawTypeButtonClassAndStyle()
    this.setUploadTypeButtonClassAndStyle()
    this.cleaSignaturePad()
    this.clearTextInput()
    this.clearFileInput()
  }

  enableTextPanel() {
    this.drawTypeButton.querySelector('input').checked = false
    this.uploadTypeButton.querySelector('input').checked = false
    this.textTypeButton.querySelector('input').checked = true
    this.textInput.parentNode.style.display = 'inherit'
    this.undoButton.parentNode.style.display = 'none'
    this.pad.off()
    if (this.isColorSelectSettingEnabled) this.colorSelect.style.visibility = 'visible'

    this.setTextTypeButtonClassAndStyle()
    this.setDrawTypeButtonClassAndStyle()
    this.setUploadTypeButtonClassAndStyle()
    this.cleaSignaturePad()
    this.loadFont()
    this.clearTextInput()
    this.clearFileInput()
  }

  enableUploadPanel() {
    this.uploadTypeButton.querySelector('input').checked = true
    this.drawTypeButton.querySelector('input').checked = false
    this.textTypeButton.querySelector('input').checked = false
    this.textInput.parentNode.style.display = 'none'
    this.undoButton.parentNode.style.display = 'none'
    this.pad.off()
    if (this.isColorSelectSettingEnabled) this.colorSelect.style.visibility = 'hidden'

    this.setTextTypeButtonClassAndStyle()
    this.setDrawTypeButtonClassAndStyle()
    this.setUploadTypeButtonClassAndStyle()
    this.cleaSignaturePad()
    this.clearTextInput()
    this.clearFileInput()
  }

  enableSaveButton() {
    if (this.isSubmitButtonSettingEnabled) {
      this.saveButton.disabled = false

      this.setSaveButtonClassAndStyle()
    }
  }

  disableSaveButton() {
    if (this.isSubmitButtonSettingEnabled) {
      this.saveButton.disabled = true

      this.setSaveButtonClassAndStyle()
    }
  }

  drawText() {
    const canvas = this.canvas
    const context = canvas.getContext('2d')

    const fontFamily = 'SignatureFont'
    const fontSize = '58px'
    const fontStyle = 'italic'
    const fontWeight = ''

    context.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily
    context.textAlign = 'center'

    context.clearRect(0, 0, canvas.width / this.scale, canvas.height / this.scale)
    context.fillText(this.textInput.value, canvas.width / 2 / this.scale, canvas.height / 2 / this.scale + 11)
  }

  drawOnCanvas (file) {
    return new Promise((resolve, reject) => {
      if (file && file.type.match('image.*')) {
        const reader = new FileReader()
        const canvas = this.canvas

        reader.onload = (event) => {
          const img = new Image()

          img.src = event.target.result

          img.onload = () => {
            const context = canvas.getContext('2d')

            const aspectRatio = img.width / img.height
            const canvasWidth = canvas.width / this.scale
            const canvasHeight = canvas.height / this.scale

            let targetWidth = canvasWidth
            let targetHeight = canvasHeight

            if (canvasWidth / canvasHeight > aspectRatio) {
              targetWidth = canvasHeight * aspectRatio
            } else {
              targetHeight = canvasWidth / aspectRatio
            }

            if (targetHeight > targetWidth) {
              const scale = targetHeight / targetWidth
              targetWidth = targetWidth * scale
              targetHeight = targetHeight * scale
            }

            const x = (canvasWidth - targetWidth) / 2
            const y = (canvasHeight - targetHeight) / 2

            setTimeout(() => {
              context.clearRect(0, 0, canvasWidth, canvasHeight)
              context.drawImage(img, x, y, targetWidth, targetHeight)
              this.pad.fromDataURL('')
              resolve()
            }, 50)
          }

          img.onerror = () => reject(new Error("Failed to load image"))
        }

        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
      } else {
        reject(new Error("Invalid file type"))
      }
    })
  }

  clearTextInput() {
    if (this.textInput) {
      this.textInput.value = ''
      this.handleDownloadState()
    }
  }

  cleaSignaturePad() {
    this.pad.clear()
    this.handleDownloadState()
  }

  clearFileInput() {
    if (this.fileInput) {
      this.fileInput.value = ''
      this.handleDownloadState()
    }
  }

  handleDownloadState() {
    if (this.pad.isEmpty() && this.textInput.value === '') {
      this.distributeSignatureData(null)
      this.disableSaveButton()
    } else {
      this.cropCanvas(this.canvas).then((blob) => {
        this.distributeSignatureData(blob)
      }).catch((error) => {
        console.error('Failed to create a PNG blob:', error)
      })

      this.enableSaveButton()
    }
  }

  distributeSignatureData(blob) {
    const nestedFileInput = this.childrenNode.querySelector('input[type="file"]')

    if (blob) {
      this.convertBlobToBase64(blob).then((base64String) => {
        this.dispatchEvent(new CustomEvent('change', { detail: { base64: base64String, blob } }))
      }).catch((error) => {
        this.dispatchEvent(new CustomEvent('change', { detail: { base64: null, blob: null } }))
        console.error('Failed to convert blob to base64:', error)
      })

      if (nestedFileInput) {
        const file = new File([blob], `signature-${Date.now()}.png`, { type: blob.type, lastModified: new Date() })
        const container = new DataTransfer()

        container.items.add(file)
        nestedFileInput.files = container.files
      }
    } else {
      this.dispatchEvent(new CustomEvent('change', { detail: { base64: null, blob: null } }))

      if (nestedFileInput) {
        nestedFileInput.value = ''
      }
    }
  }

  convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]
        resolve(base64String)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(blob)
    })
  }

  loadFont() {
    if (!this.isFontLoaded) {
      const fontUrl = this.dataset.fontUrl || 'https://cdn.jsdelivr.net/npm/@fontsource/dancing-script/files/dancing-script-latin-400-normal.woff'
      const font = new FontFace('SignatureFont', `url(${fontUrl})`)

      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont)
        this.isFontLoaded = true
      }).catch((error) => {
        console.error('Font loading failed:', error)
      })
    }
  }

  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.style = 'display: none'
    a.href = url
    a.download = filename

    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)

    return new Promise((resolve) => {
      resolve()
    })
  }

  cropCanvas(canvas) {
    const ctx = canvas.getContext('2d')

    const width = canvas.width
    const height = canvas.height

    let topmost = height
    let bottommost = 0
    let leftmost = width
    let rightmost = 0

    const imageData = ctx.getImageData(0, 0, width, height)
    const pixels = imageData.data

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4
        const alpha = pixels[pixelIndex + 3]

        if (alpha !== 0) {
          topmost = Math.min(topmost, y)
          bottommost = Math.max(bottommost, y)
          leftmost = Math.min(leftmost, x)
          rightmost = Math.max(rightmost, x)
        }
      }
    }

    const croppedWidth = rightmost - leftmost + 1
    const croppedHeight = bottommost - topmost + 1

    const croppedCanvas = document.createElement('canvas')
    croppedCanvas.width = croppedWidth
    croppedCanvas.height = croppedHeight
    const croppedCtx = croppedCanvas.getContext('2d')

    croppedCtx.drawImage(canvas, leftmost, topmost, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)

    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create a PNG blob.'))
        }
      }, 'image/png')
    })
  }

  disconnectedCallback() {
    this.fieldNode.remove()

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this)
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(this.canvas)
    }
  }

  get tempalte() {
    return `
          <div>
            <div>
              <div data-target="typeButtonsContainer">
                <div>
                  <label data-target="drawTypeButton">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M3 19c3.333 -2 5 -4 5 -6c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 2.877 2.5 4c1.5 2 2.5 2.5 3.5 1c.667 -1 1.167 -1.833 1.5 -2.5c1 2.333 2.333 3.5 4 3.5h2.5"></path>
                      <path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z"></path>
                      <path d="M16 7h4"></path>
                    </svg>
                    <span>${this.defaultLabels.drawTypeButton}</span>
                    <input type="radio" name="type_option" id="draw_radio" value="draw" style="display: none;">
                  </label>
                </div>
                <div>
                  <label data-target="textTypeButton">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M3 7v-2h13v2"></path>
                      <path d="M10 5v14"></path>
                      <path d="M12 19h-4"></path>
                      <path d="M15 13v-1h6v1"></path>
                      <path d="M18 12v7"></path>
                      <path d="M17 19h2"></path>
                    </svg>
                    <span>${this.defaultLabels.textTypeButton}</span>
                    <input type="radio" name="type_option" id="text_radio" value="draw" style="display: none;">
                  </label>
                </div>
                <div>
                  <label data-target="uploadTypeButton" for="signature_file_upload">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.5rem; height: 1.5rem;" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                      <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    </svg>
                    <span>${this.defaultLabels.uploadTypeButton}</span>
                    <input data-target="fileInput" id="signature_file_upload" type="file" accept="image/*" style="display: none;">
                    <input type="radio" name="type_option" id="upload_radio" value="upload" style="display: none;">
                  </label>
                </div>
              </div>
            </div
            <div>
              <div>
                <input placeholder="${this.defaultLabels.textInputPlaceholder}" data-target="textInput">
              </div>
              <div>
                <canvas data-target="canvas"></canvas>
              </div>
              <div data-target="controlButtonsContainer">
                <div data-target="colorSelect" style="display: flex; gap: 1rem;">
                  <input aria-label="Black" type="radio" data-target="colorInput" name="color" value="#000000" style="accent-color: #000000; transform: scale(1.5);" checked>
                  <input aria-label="Blue" type="radio" data-target="colorInput" name="color" value="#3B82F6" style="accent-color: #3B82F6; transform: scale(1.5);">
                  <input aria-label="Green" type="radio" data-target="colorInput" name="color" value="#008000" style="accent-color: #008000; transform: scale(1.5);">
                  <input aria-label="Red" type="radio" data-target="colorInput" name="color" value="#EF4444" style="accent-color: #EF4444; transform: scale(1.5);">
                </div>
                <div>
                  <span>
                    <button aria-label="Undo" data-target="undoButton">
                      <svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 14l-4 -4l4 -4"></path>
                        <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path>
                      </svg>
                      <span>${this.defaultLabels.undoButton}</span>
                    </button>
                  </span>
                  <span>
                    <button aria-label="Clear" data-target="clearButton">
                      <svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"></path>
                        <path d="M20 4v5h-5"></path>
                      </svg>
                      <span>${this.defaultLabels.clearButton}</span>
                    </button>
                  </span>
                </div>
              </div>
              <div>
                <button data-target="saveButton">
                  <span>${this.defaultLabels.saveButton}</span>
                </button>
              </div>
            </div>
          </div>
        `
  }
}

if (typeof window !== 'undefined' && window.customElements && !window.customElements.get("signature-maker")) {
  window.customElements.define("signature-maker", SignatureMarker);
} else {
  throw new Error('signature-maker-js can only be used in a browser environment.')
}
