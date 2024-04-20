import type ColorPicker from './color-picker'
import { prefix } from './util'

export class Swatches {
    container!: HTMLElement
    constructor(private picker: ColorPicker) {}

    init(colors: string[]) {
        console.log('[Swatches] init', colors)
        const container = (this.container = document.createElement('div'))
        container.classList.add(prefix('Swatches'))

        colors.forEach((color) => {
            const swatch = document.createElement('div')
            swatch.classList.add(prefix('SwatchesItem'))
            swatch.style.backgroundColor = color
            swatch.addEventListener('click', () => {
                this.picker.setColor(color)
            })
            container.appendChild(swatch)
        })

        this.picker.container.appendChild(container)
    }
}
