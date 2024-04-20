import type Coloris from './color-picker'
import { RGBAToStr, getXY, prefix } from './util'

export class SVArea {
    area!: HTMLElement
    maker!: HTMLElement
    rect!: DOMRect

    constructor(private picker: Coloris) {}

    init() {
        this.initArea()
        this.initMaker()
        this.update()
    }

    initArea = () => {
        const area = (this.area = document.createElement('div'))

        this.picker.container.appendChild(area)

        area.classList.add(prefix('Gradient'))
        area.addEventListener('pointerdown', this.pointerDown)
    }

    pointerDown = (e: PointerEvent) => {
        document.addEventListener('pointerup', this.pointerUp)
        document.addEventListener('pointermove', this.pointerMove)
        this.rect = this.area.getBoundingClientRect()
        this.pointerMove(e)
    }

    pointerMove = (e: PointerEvent) => {
        const [x, y] = getXY(e, this.rect, true)
        this.updateByXy(x, y)
    }

    pointerUp = () => {
        document.removeEventListener('pointermove', this.pointerMove)
        document.removeEventListener('pointerup', this.pointerUp)
    }

    initMaker = () => {
        const maker = (this.maker = document.createElement('div'))
        maker.classList.add(prefix('Marker'))

        this.area.appendChild(maker)
        this.rect = this.area.getBoundingClientRect()
    }

    update = () => {
        this.updateAreaStyle()
        this.updateMarkerStyle()
    }

    updateByXy = (x: number, y: number) => {
        this.picker.hsva = {
            ...this.picker.hsva,
            s: (x / this.rect.width) * 100,
            v: 100 - (y / this.rect.height) * 100,
        }
        this.updateAreaStyle()
        this.updateMarkerStyle()
    }

    updateAreaStyle() {
        this.area.style.color = `hsl(${this.picker.hsva.h},100%,50%)`
    }

    updateMarkerStyle() {
        this.maker.style.color = RGBAToStr(this.picker.rgba, false)
        this.maker.style.left = this.picker.hsva.s + '%'
        this.maker.style.top = 100 - this.picker.hsva.v + '%'
    }
}
