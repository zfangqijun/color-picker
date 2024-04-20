import type Coloris from './color-picker'
import { RGBAToHex, prefix, strToRGBA } from './util'

class Preview {
    preview!: HTMLElement
    input!: HTMLInputElement
    constructor(private picker: Coloris) {}

    init() {
        const container = document.createElement('div')
        container.classList.add(prefix('Preview'))

        const block = (this.preview = document.createElement('div'))
        block.classList.add(prefix('PreviewBlock'))

        const input = (this.input = document.createElement('input'))
        input.classList.add(prefix('PreviewInput'))
        input.addEventListener('change', (e) => {
            this.picker.rgba = strToRGBA((e.target as HTMLInputElement).value)
            this.update()
        })

        container.appendChild(block)
        container.appendChild(input)

        this.picker.container.appendChild(container)
        this.update()
    }

    update() {
        const hex = RGBAToHex(this.picker.rgba, this.picker.options.alpha)
        this.preview.style.color = hex
        this.input.value = hex
    }
}

export default Preview
