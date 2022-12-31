import * as scryfall from 'utils/scryfall'

export enum ColorGroup {
  White = 'W',
  Blue = 'U',
  Black = 'B',
  Red = 'R',
  Green = 'G',
  Multicolor = 'Multicolor',
  Colorless = 'Colorless',
  Land = 'Land'
}

/**
 * Returns the 'color group' for a card of colors and type. This includes the
 * 5 mono-colors, multicolor, colorless, and land in separate groups.
 */
export function colorGroup(
  colors: scryfall.Color[],
  type_line: string
): ColorGroup {
  if (type_line.match(/\bLand\b/)) {
    return ColorGroup.Land
  }
  if (colors.length > 1) {
    return ColorGroup.Multicolor
  }
  if (colors.length === 0) {
    return ColorGroup.Colorless
  }

  return colors[0] as any
}
