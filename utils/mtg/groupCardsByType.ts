import { groupBy, sortBy } from 'lodash'

const typeRegex = /(\w+)( —|$)/

const typeOrder: Record<string, number> = {
  Creature: 0,
  Planeswalker: 1,
  Artifact: 2,
  Enchantment: 3,
  Instant: 4,
  Sorcery: 5,
  Land: 6,
  Other: 7
}

export const groupCardsByType = <
  T extends { typeLine: string; count?: number }
>(
  cards: T[]
): { type: string; cards: T[]; length: number }[] => {
  const grouped = groupBy(
    cards,
    (card) => card.typeLine?.match(typeRegex)?.[1] ?? 'Other'
  )

  return sortBy(
    Object.keys(grouped)
      .map((type) => ({
        type,
        cards: grouped[type]
      }))
      .map((g) => ({
        ...g,
        length: g.cards.reduce((total, card) => (card.count ?? 1) + total, 0)
      })),
    (group) => typeOrder[group.type]
  )
}
