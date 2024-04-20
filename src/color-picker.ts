import Preview from './preview'
import { AlphaSlider, HueSlider } from './slider'
import { SVArea } from './sv-area'
import { Swatches } from './swatches'
import { HSVA, HSVAtoRGBA, RGBA, RGBAToHex, RGBAtoHSVA, prefix, strToRGBA } from './util'

interface Options {
    root: HTMLElement
    /**
     * 默认颜色
     */
    defaultColor?: string
    alpha?: boolean
    /**
     * 预设色板
     */
    swatches?: string[] | null
    onChange?: (e: { rgba: RGBA; hex: string }) => void
    onEyeDropper?: () => void
    onClear?: () => void
}

const defaultOptions: Required<Omit<Options, 'root'>> = {
    defaultColor: '#ff0000',
    alpha: true,
    swatches: null,
    onChange: () => {},
    onEyeDropper: () => {},
    onClear: () => {},
}

class ColorPicker {
    container!: HTMLElement
    options = defaultOptions
    hsva_ = { h: 0, s: 0, v: 0, a: 1 }
    rgba_ = { r: 0, g: 0, b: 0, a: 1 }
    preview?: Preview
    area?: SVArea
    hueSlider?: HueSlider
    alphaSlider?: AlphaSlider

    get hsva() {
        return this.hsva_
    }

    get rgba() {
        return this.rgba_
    }

    set hsva(hsva: HSVA) {
        this.hsva_ = hsva
        this.rgba_ = HSVAtoRGBA(hsva)
        this.options.onChange({
            rgba: this.rgba_,
            hex: RGBAToHex(this.rgba_),
        })
        this.update()
    }

    set rgba(rgba: RGBA) {
        this.rgba_ = rgba
        this.hsva_ = RGBAtoHSVA(rgba)
        this.options.onChange({
            rgba: this.rgba_,
            hex: RGBAToHex(this.rgba_),
        })
        this.update()
    }

    setupOptions(options: Omit<Options, 'root'>) {
        this.options = { ...this.options, ...options }
    }

    init({ root, ...options }: Options) {
        console.debug('[ColorPicker] init', options)

        this.setupOptions(options)

        this.container = document.createElement('div')
        this.container.classList.add('colorPicker')

        this.rgba = strToRGBA(this.options.defaultColor)

        root.appendChild(this.container)

        this.area = new SVArea(this)
        this.area.init()

        this.hueSlider = new HueSlider(this)
        this.hueSlider.init()

        if (this.options.alpha) {
            this.alphaSlider = new AlphaSlider(this)
            this.alphaSlider.init()
        }

        this.preview = new Preview(this)
        this.preview.init()

        if (this.options.swatches) {
            const swatches = new Swatches(this)
            swatches.init(this.options.swatches)
        }

        const bottomButtons = document.createElement('div')
        bottomButtons.classList.add(prefix('BottomButtons'))

        const clearButton = document.createElement('button')
        clearButton.classList.add(prefix('ClearButton'))
        clearButton.textContent = '✖'
        clearButton.addEventListener('click', this.options.onClear)

        const eyeDropperButton = document.createElement('button')
        eyeDropperButton.classList.add(prefix('EyeDropperButton'))
        eyeDropperButton.textContent = '🎨'

        eyeDropperButton.addEventListener('click', () => {
            // @ts-ignore
            const EyeDropper = window.EyeDropper
            if (EyeDropper) {
                new EyeDropper()
                    .open()
                    .then((result: { sRGBHex: string }) => {
                        this.rgba = strToRGBA(result.sRGBHex)
                    })
                    .catch(console.warn)
            } else {
                this.options.onEyeDropper()
            }
        })

        bottomButtons.append(clearButton, eyeDropperButton)

        this.container.append(bottomButtons)
    }

    update() {
        this.preview?.update()
        this.area?.update()
        this.hueSlider?.update()
        this.alphaSlider?.update()
    }

    setColor(color: string) {
        this.rgba_ = strToRGBA(color)
        this.hsva_ = RGBAtoHSVA(this.rgba_)
        this.update()
    }
}

export default ColorPicker
