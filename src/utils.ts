/**
 * @fileoverview
 * Chroma docs: https://gka.github.io/chroma.js
 */

import _chroma, { Color as ChromaColor } from 'chroma-js'

import { Hex, RgbaConfig, RgbaString, Percent, ColorFromHexOptions } from './types'

export const chroma = _chroma

export const genRandomChromaColor = () => {
  return _chroma.random()
}

export const genRandomHex = (): Hex => {
  return genRandomChromaColor().hex() as Hex
}

export const genRandomRgba = (): RgbaString => {
  return getRgbaByConfig(genRandomRgbaConfig())
}

export const genRandomRgbaConfig = (): RgbaConfig => {
  const [red, green, blue, alpha] = genRandomChromaColor().rgba()

  return {
    red,
    green,
    blue,
    alpha,
  }
}

export const convertColorToChromaSafe = (
  color?: Hex | RgbaString | any,
  fallbackColor?: Hex | RgbaString
): ChromaColor | undefined => {
  try {
    return _chroma(`${color}`)
  } catch (err) {
    if (fallbackColor) {
      return convertColorToChromaSafe(fallbackColor)
    }
  }
}

export const convertHexToRgba = (hex, opts: { alpha?: number } = {}): RgbaString => {
  const { alpha } = opts

  try {
    const getChroma = () => {
      const color = chroma(hex)
      if (!validateAlpha(alpha)) {
        return color
      }

      return color.alpha(alpha!)
    }

    return `rgba(${getChroma().rgba().join(',')})` as RgbaString
  } catch (err) {
    return ''
  }
}

export const getRgbaConfig = (rgba: RgbaString = ''): RgbaConfig => {
  const parts = chroma(rgba).rgba()

  const alpha = parts[3]
  return {
    red: parts[0],
    green: parts[1],
    blue: parts[2],
    alpha: alpha !== undefined ? alpha : 1,
  }
}

export const getRgbaByConfig = (rgba: RgbaConfig, optAlpha?: number): RgbaString => {
  const { red, green, blue, alpha } = rgba
  const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`

  if (!validateAlpha(optAlpha)) {
    return color as RgbaString
  }

  return chroma(color).alpha(optAlpha!).css() as RgbaString
}

export const validateAlpha = (alpha?: number | null): boolean => {
  return (!!alpha || alpha === 0) && alpha >= 0 && alpha <= 1
}

export const validateShade = (shade?: number | null): boolean => {
  return !!shade && Math.abs(shade) <= 1
}

export const validateRgba = (rgba: RgbaString): boolean => {
  if (!rgba.startsWith('rgb(') && !rgba.startsWith('rgba(')) {
    return false
  }

  return chroma.valid(rgba)
}

export const validateChromaColor = (color?: ChromaColor): boolean => {
  try {
    return !!color && chroma.valid(color.hex())
  } catch (err) {
    return false
  }
}

export const validateHex = (color: string): boolean => {
  if (!color) {
    return false
  }

  // Validate hex values
  if (color.substring(0, 1) === '#') {
    color = color.substring(1)
  }

  switch (color.length) {
    case 3:
      return /^[0-9A-F]{3}$/i.test(color)
    case 6:
      return /^[0-9A-F]{6}$/i.test(color)
    case 8:
      return /^[0-9A-F]{8}$/i.test(color)
    default:
      return false
  }
}

/**
 * * From https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 *
 * @param hex The color to shade
 * @param percent The percent to shade by. The greater the percent, the lighter the color will be, and vise versa.
 * @returns
 */
export const shadeHex = (hex: Hex, percent: Percent): Hex => {
  const f = parseInt(hex.slice(1), 16)
  const t = percent < 0 ? 0 : 255
  const p = percent < 0 ? percent * -1 : percent
  const R = f >> 16
  const G = (f >> 8) & 0x00ff
  const B = f & 0x0000ff

  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`
}

export const transformHex = (hex: Hex, opts: ColorFromHexOptions = {}): Hex => {
  const { opacity: alpha, shade } = opts

  const hasValidShade = validateShade(shade)
  const hasValidAlpha = validateAlpha(alpha)

  if (!hasValidShade && !hasValidAlpha) {
    return hex as Hex
  }

  const shadedHex = hasValidShade ? shadeHex(hex, shade!) : hex

  if (!hasValidAlpha) {
    return shadedHex
  }

  const colorWithAlpha = chroma(shadedHex).alpha(alpha!)
  return colorWithAlpha.hex() as Hex
}
