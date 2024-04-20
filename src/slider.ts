import type Coloris from './color-picker'
import { RGBAToStr, prefix } from './util'

class HueSlider {
    marker!: HTMLDivElement
    container!: HTMLDivElement
    classNames = [prefix('HueSlider')]
    markerClassNames: string[] = []
    min = '0'
    max = '359'

    constructor(protected picker: Coloris) {}

    init() {
        const container = (this.container = document.createElement('div'))
        container.classList.add(prefix('Slider'), ...this.classNames)

        const marker = (this.marker = document.createElement('div'))
        marker.classList.add(prefix('Marker'), ...this.markerClassNames)
        container.appendChild(marker)

        const slider = document.createElement('input')
        container.appendChild(slider)

        slider.type = 'range'
        slider.min = this.min
        slider.max = this.max
        slider.value = '0'
        slider.addEventListener('input', this.onInput)

        this.picker.container.appendChild(container)
        this.update()
    }

    onInput = (e: Event) => {
        this.picker.hsva = {
            ...this.picker.hsva,
            h: Number((e.target as HTMLInputElement).value),
        }
        this.update()
    }

    update = () => {
        this.marker.style.left = (this.picker.hsva.h / 359) * 100 + '%'
        this.container.style.color = `hsl(${this.picker.hsva.h},100%,50%)`
    }
}

class AlphaSlider extends HueSlider {
    classNames = [prefix('AlphaSlider')]
    markerClassNames = [prefix('AlphaSliderMarker')]
    min = '0'
    max = '100'

    onInput = (e: Event) => {
        this.picker.hsva = {
            ...this.picker.hsva,
            a: Number((e.target as HTMLInputElement).value) / 100,
        }
        this.update()
    }

    update = () => {
        this.marker.style.left = this.picker.hsva.a * 100 + '%'
        this.container.style.color = RGBAToStr(this.picker.rgba, true)
    }
}

export { HueSlider, AlphaSlider }
