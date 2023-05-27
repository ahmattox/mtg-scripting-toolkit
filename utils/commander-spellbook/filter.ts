import { uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { Combo } from './types'

/**
 * Filter a set of combos based on if they contain a specific card name.
 */
export function combosWithCard(combos: Combo[], cardName: string) {
  return combos.filter((combo) => combo.cardNames.includes(cardName))
}

/**
 * Filter a set of combos based on if they contain a specific outcome. The
 * outcome string must match exactly.
 */
export function uniqueOutcomes(combos: Combo[]) {
  return uniq(combos.flatMap((combo) => combo.results))
}

/**
 * Filter a set of combos based on if all cards included are legal in a given
 * format.
 */
export function legalInFormat(combos: Combo[], format: scryfall.Format) {
  return combos.filter((combo) => combo.legalities[format] === 'legal')
}
