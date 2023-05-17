import * as scryfall from 'utils/scryfall'

/**
 * Given a set of Scryfall bulk data, filters out tokens, and art series and
 * other non-playable extras.
 */
export function filterExtras(cards: scryfall.Card[]) {
  return cards.filter((card) => {
    return (
      card.layout !== 'art_series' &&
      card.layout !== 'token' &&
      card.layout !== 'double_faced_token' &&
      card.layout !== 'emblem' &&
      card.set_type !== 'memorabilia'
    )
  })
}
