import { uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'

const doubleFacedCardLayouts = ['transform', 'modal_dfc']

export function colors(card: scryfall.Card): scryfall.Color[] {
  if (doubleFacedCardLayouts.includes(card.layout) && card.card_faces != null) {
    return uniq(card.card_faces.flatMap((face) => face.colors))
  }
  return card.colors ?? []
}
