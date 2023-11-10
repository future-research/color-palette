import { Color } from './Color'

export type Hex = `#${string}`
export type Percent = number

export type RgbaString =
  | `rgba(${string}, ${string}, ${string})`
  | `rgba(${string}, ${string}, ${string}, ${number})`
  | ''

export interface RgbaConfig {
  red: number
  green: number
  blue: number
  alpha: Percent
}

export interface ColorPalette {
  base: Color
}

export interface ColorFromPaletteOptions {
  base?: Color
}

export interface ColorFromHexOptions {
  opacity?: Percent
  shade?: Percent
}
