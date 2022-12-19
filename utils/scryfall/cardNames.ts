import { compact } from 'lodash'

import { Card, SetType, CardLayout } from './types'

const doubleFacedCardLayouts = [CardLayout.Transform, CardLayout.ModalDfc]

// Certain tokens like 'Lost Mine of Phandelver' are returned in normal searches
const excludedSetTypes = [SetType.Memorabilia, SetType.Token]

/**
 * Returns the filtered names from a set of card object. Excludes certain extra
 * card types and handles names of double faced cards.
 */
export function cardNames(cards: Card[]): string[] {
  return compact(
    cards.map((card) => {
      if (excludedSetTypes.includes(card.set_type)) {
        return null
      }

      if (
        doubleFacedCardLayouts.includes(card.layout) &&
        card.card_faces != null
      ) {
        return card.card_faces[0].name
      }

      return card.name
    })
  )
}
