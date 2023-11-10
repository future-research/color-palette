import chroma from 'chroma-js'
import { getRgbaByConfig, getRgbaConfig, convertHexToRgba, transformHex } from './utils'
import {
  ColorPalette,
  ColorFromHexOptions,
  ColorFromPaletteOptions,
  Hex,
  RgbaConfig,
  RgbaString,
} from './types'
import { deepFreeze } from './internal/utils'

const TRANSPARENT_COLOR_RGBA = 'rgba(255, 255, 255, 0)'
const PRIVATE_CONSTRUCTOR_KEY = Symbol()
const PRIVATE_TRANSPARENT_BASE_KEY = Symbol()

export class Color<P = ColorPalette> {
  #hex: Hex
  #rgbaConfig: RgbaConfig
  #wasProvidedHex: boolean
  #colorPalette: P & ColorPalette
  #isTransparentBase: boolean
  #isDebuggingEnabled = true

  constructor({
    hex,
    rgba,
    palette,
    __constructorKey,
    __transparentBaseKey,
  }: {
    hex?: Hex
    rgba?: RgbaString
    palette?: P & ColorFromPaletteOptions
    __constructorKey?: symbol
    __transparentBaseKey?: symbol
  }) {
    if (__constructorKey !== PRIVATE_CONSTRUCTOR_KEY) {
      throw new Error('Use one of the factory functions to construct a new Color instance.')
    }

    this.#wasProvidedHex = !!hex
    this.#colorPalette = (palette || {}) as P & ColorPalette

    if (!this.#colorPalette.base) {
      this.#colorPalette.base = this as unknown as Color<ColorPalette>
    }

    this.#colorPalette.toString = () => {
      return this.toString()
    }

    Object.entries(this.#colorPalette).forEach(([key, value]) => {
      if (this[key]) {
        return
      }
      this[key] = value
    })

    this.#hex = hex || ('' as Hex)
    this.#rgbaConfig = getRgbaConfig((rgba ? rgba : convertHexToRgba(hex)) as RgbaString)

    if (!this.#wasProvidedHex) {
      this.#hex = this.toChroma().hex() as Hex
    }

    this.#isTransparentBase =
      __transparentBaseKey === PRIVATE_TRANSPARENT_BASE_KEY && this.#rgbaConfig.alpha === 0

    this.#colorPalette = deepFreeze(this.#colorPalette)
  }

  get base() {
    return this.#colorPalette.base
  }

  get isTransparentBase() {
    return this.#isTransparentBase
  }

  get isDebuggingEnabled() {
    return this.#isDebuggingEnabled
  }

  /**
   * This is prefixed with 'z' so that it shows up last in autocomplete UIs
   * because this field is rarely needed.
   *  @protected
   */
  get zPalette() {
    return this.#colorPalette as unknown as typeof this
  }

  toString() {
    _maybeWarnOfTransparentBaseUsage(this)

    if (this.#wasProvidedHex) {
      return this.#hex
    }
    return this.toRgba()
  }

  toHex(opts: ColorFromHexOptions = {}): Hex {
    _maybeWarnOfTransparentBaseUsage(this)

    return transformHex(this.#hex, !this.#isTransparentBase ? opts : undefined)
  }

  toRgba(opts: { opacity?: number } = {}) {
    _maybeWarnOfTransparentBaseUsage(this)

    const { opacity: alpha } = opts
    return getRgbaByConfig(this.#rgbaConfig, !this.#isTransparentBase ? alpha : undefined)
  }

  toChroma() {
    _maybeWarnOfTransparentBaseUsage(this)

    return chroma(this.toString())
  }

  setDebug(status: boolean) {
    this.#isDebuggingEnabled = !!status
  }

  static fromRgba(rgba) {
    return new Color({ rgba, __constructorKey: PRIVATE_CONSTRUCTOR_KEY })
  }

  static fromHex(hex: Hex, opts: ColorFromHexOptions = {}) {
    const transformedHex = transformHex(hex, opts)

    return new Color({
      hex: transformedHex,
      __constructorKey: PRIVATE_CONSTRUCTOR_KEY,
    })
  }

  static fromPalette<P>(palette: P & ColorFromPaletteOptions): Color & P {
    if (!palette.base) {
      palette.base = palette.base || _genTransparentBaseColor()
    }

    const color = Color.fromColor(palette.base)
    color.setDebug(false)
    const hex = color.toHex()
    color.setDebug(true)

    return new Color({
      hex,
      palette,
      __constructorKey: PRIVATE_CONSTRUCTOR_KEY,
    }) as unknown as Color & P
  }

  static fromColor(color: Color, opts?: ColorFromHexOptions) {
    color.setDebug(false)
    const hex = color.toHex()
    color.setDebug(true)

    return Color.fromHex(hex, opts)
  }
}

const _genTransparentBaseColor = () => {
  const color = new Color({
    rgba: TRANSPARENT_COLOR_RGBA,
    __constructorKey: PRIVATE_CONSTRUCTOR_KEY,
    __transparentBaseKey: PRIVATE_TRANSPARENT_BASE_KEY,
  })
  return color
}

const _maybeWarnOfTransparentBaseUsage = <P>(color: Color<P>) => {
  if (color.isTransparentBase && color.isDebuggingEnabled) {
    console.warn(
      `You're attempting to use a transparent base color. This is likely an error.`,
      color
    )
  }
}
