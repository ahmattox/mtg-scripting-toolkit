import { sortBy } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { types } from './cardTypes'
import { colorGroup } from './colorGroup'
import { normalizeColorIdentity, colorIdentityOrder } from './sort'

const typeOrder: Record<string, number> = {
  Creature: 0,
  Instant: 1,
  Sorcery: 2,
  Artifact: 3,
  Enchantment: 4,
  Planeswalker: 5,
  Land: 6
}

const colorGroupOrder: Record<string, number> = {
  W: 0,
  U: 1,
  B: 2,
  R: 3,
  G: 4,
  Multicolor: 5,
  Colorless: 6,
  Land: 7
}

/**
 * Sorts a list of cards cards in a "normal" way.
 *
 * Cards are ordered by their "color group" (monocolors, multicolors, colorless,
 * lands), then by type, and then mana value.
 */
export function magicSort(cards: scryfall.Card[]) {
  const cardsWithMeta = cards.map((card) => {
    const cardColorGroup = colorGroup(card)
    const colorGroupIndex = colorGroupOrder[cardColorGroup]

    const cardTypes = types(card).types
    const cardTypeIndex = typeOrder[cardTypes[cardTypes.length - 1]]

    const landOrGoldColorIdentityIndex =
      cardColorGroup === 'Multicolor' || cardColorGroup === 'Land'
        ? colorIdentityOrder[normalizeColorIdentity(card.color_identity)]
        : 0

    return {
      card,
      colorGroupIndex,
      cardTypeIndex,
      landOrGoldColorIdentityIndex,
      manaValue: card.cmc,
      devotion: card.mana_cost?.length ?? 0, // lazy proxy for devotion
      name: card.name
    }
  })

  return sortBy(cardsWithMeta, [
    'colorGroupIndex',
    'cardTypeIndex',
    'landOrGoldColorIdentityIndex',
    'manaValue',
    'devotion',
    'name'
  ]).map((c) => c.card)
}
