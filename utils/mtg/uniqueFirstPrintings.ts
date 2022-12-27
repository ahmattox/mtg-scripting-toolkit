import { uniqBy } from 'lodash'

import * as scryfall from '../scryfall'

/**
 * Given a set of Scryfall bulk data, get the first unique printing of each
 * card. Filters out reprints, alternate card versions, tokens, and art series
 * cards.
 */
export function uniqueFirstPrintings(cards: scryfall.Card[]) {
  return uniqBy(
    cards.filter((card) => {
      return (
        card.reprint === false &&
        card.layout !== 'art_series' &&
        card.layout !== 'token' &&
        card.layout !== 'double_faced_token' &&
        card.layout !== 'emblem' &&
        card.set_type !== 'memorabilia'
      )
    }),
    (card) => card.name
  )
}
