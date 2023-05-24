import { mapValues } from 'lodash'

import * as scryfall from 'utils/scryfall'

/**
 * Returns an object representing the collective legality in all formats tracked
 * by Scryfall. This doesn't preserve 'banned' or 'restricted' levels, but just
 * whether a group of cards is all legal in each format or not.
 */
export function collectiveLegality(
  cards: scryfall.Card[]
): Record<scryfall.Format, 'legal' | 'not_legal'> | null {
  return cards.reduce((result, card) => {
    if (result == null) {
      return mapValues(card.legalities, (value) =>
        value === 'legal' ? 'legal' : 'not_legal'
      )
    }

    for (const format of scryfall.formats) {
      result[format] =
        result[format] === 'legal' && card.legalities[format] === 'legal'
          ? 'legal'
          : 'not_legal'
    }

    return result
  }, null as Record<scryfall.Format, 'legal' | 'not_legal'> | null)
}
