import { uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { Combo } from './types'

export function combosWithCard(combos: Combo[], cardName: string) {
  return combos.filter((combo) => combo.cardNames.includes(cardName))
}

export function uniqueOutcomes(combos: Combo[]) {
  return uniq(combos.flatMap((combo) => combo.results))
}

export function legalInFormat(combos: Combo[], format: scryfall.Format) {
  return combos.filter((combo) => combo.legalities[format] === 'legal')
}
