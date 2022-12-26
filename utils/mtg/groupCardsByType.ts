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

export const groupCardsByType = <T extends { type_line: string }>(
  cards: T[]
): { type: string; cards: T[] }[] => {
  const grouped = groupBy(
    cards,
    (card) => card.type_line?.match(typeRegex)?.[1] ?? 'Other'
  )

  return sortBy(
    Object.keys(grouped).map((type) => ({
      type,
      cards: grouped[type]
    })),
    (group) => typeOrder[group.type]
  )
}
