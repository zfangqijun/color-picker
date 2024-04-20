export type HSVA = {
    h: number
    s: number
    v: number
    a: number
}

export type RGBA = {
    r: number
    g: number
    b: number
    a: number
}

export type HSLA = {
    h: number
    s: number
    l: number
    a: number
}

export function prefix(str: string) {
    return 'colorPicker' + str
}

export function getXY(e: PointerEvent, rect: DOMRect, clamp: boolean = false) {
    // 获取鼠标xy，相对于元素
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    if (clamp) {
        x = Math.max(0, Math.min(x, rect.width))
        y = Math.max(0, Math.min(y, rect.height))
    }
    return [x, y]
}

export function HSVAtoRGBA(hsva: HSVA): RGBA {
    const saturation = hsva.s / 100
    const value = hsva.v / 100
    let chroma = saturation * value
    let hueBy60 = hsva.h / 60
    let x = chroma * (1 - Math.abs((hueBy60 % 2) - 1))
    let m = value - chroma

    chroma = chroma + m
    x = x + m

    const index = Math.floor(hueBy60) % 6
    const red = [chroma, x, m, m, x, chroma][index]
    const green = [x, chroma, chroma, x, m, m][index]
    const blue = [m, m, x, chroma, chroma, x][index]

    return {
        r: Math.round(red * 255),
        g: Math.round(green * 255),
        b: Math.round(blue * 255),
        a: hsva.a,
    }
}

export function HSVAtoHSLA(hsva: HSVA): HSLA {
    const value = hsva.v / 100
    const lightness = value * (1 - hsva.s / 100 / 2)
    let saturation

    if (lightness > 0 && lightness < 1) {
        saturation = Math.round(((value - lightness) / Math.min(lightness, 1 - lightness)) * 100)
    }

    return {
        h: hsva.h,
        s: saturation || 0,
        l: Math.round(lightness * 100),
        a: hsva.a,
    }
}

export function RGBAtoHSVA(rgba: RGBA): HSVA {
    const red = rgba.r / 255
    const green = rgba.g / 255
    const blue = rgba.b / 255
    const xmax = Math.max(red, green, blue)
    const xmin = Math.min(red, green, blue)
    const chroma = xmax - xmin
    const value = xmax
    let hue = 0
    let saturation = 0

    if (chroma) {
        if (xmax === red) {
            hue = (green - blue) / chroma
        }
        if (xmax === green) {
            hue = 2 + (blue - red) / chroma
        }
        if (xmax === blue) {
            hue = 4 + (red - green) / chroma
        }
        if (xmax) {
            saturation = chroma / xmax
        }
    }

    hue = Math.floor(hue * 60)

    return {
        h: hue < 0 ? hue + 360 : hue,
        s: Math.round(saturation * 100),
        v: Math.round(value * 100),
        a: rgba.a,
    }
}

export function RGBAToHex(rgba: RGBA, alpha: boolean = true) {
    let R = rgba.r.toString(16)
    let G = rgba.g.toString(16)
    let B = rgba.b.toString(16)
    let A = ''

    if (rgba.r < 16) {
        R = '0' + R
    }

    if (rgba.g < 16) {
        G = '0' + G
    }

    if (rgba.b < 16) {
        B = '0' + B
    }

    if (alpha) {
        const alpha = (rgba.a * 255) | 0
        A = alpha.toString(16)

        if (alpha < 16) {
            A = '0' + A
        }
    }

    return '#' + R + G + B + A
}

const ctx = document.createElement('canvas').getContext('2d')!

export function strToRGBA(str: string) {
    const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i

    // Default to black for invalid color strings
    ctx.fillStyle = '#000'

    // Use canvas to convert the string to a valid color string
    ctx.fillStyle = str

    const match = regex.exec(ctx.fillStyle)
    let rgba: RGBA
    if (match) {
        rgba = {
            r: +match[3],
            g: +match[4],
            b: +match[5],
            a: +match[6],
        }
    } else {
        const match = ctx.fillStyle
            .replace('#', '')
            .match(/.{2}/g)!
            .map((h) => parseInt(h, 16))
        rgba = {
            r: match[0],
            g: match[1],
            b: match[2],
            a: 1,
        }
    }

    return rgba
}

export function RGBAToStr(rgba: RGBA, alpha: boolean = true) {
    const { r, g, b, a } = rgba
    if (alpha) {
        return `rgba(${r},${g},${b},${a})`
    } else {
        return `rgb(${r},${g},${b})`
    }
}

export function HSLAToStr(hsla: HSLA) {
    // if (!settings.alpha || (hsla.a === 1 && !settings.forceAlpha)) {
    //     return `hsl(${hsla.h}, ${hsla.s}%, ${hsla.l}%)`
    // } else {
    return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`
    // }
}

export function clamp(min: number, max: number, value: number) {
    return Math.max(min, Math.min(max, value))
}
