import * as scryfall from 'utils/scryfall'

import { colors } from './cardColors'

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
export function colorGroup(card: scryfall.Card): ColorGroup {
  const type_line =
    card.layout === 'transform' ? card.card_faces![0].type_line : card.type_line
  const cardColors = colors(card)

  if (type_line.match(/\bLand\b/)) {
    return ColorGroup.Land
  }
  if (cardColors.length > 1) {
    return ColorGroup.Multicolor
  }
  if (cardColors.length === 0) {
    return ColorGroup.Colorless
  }

  return cardColors[0] as any
}
