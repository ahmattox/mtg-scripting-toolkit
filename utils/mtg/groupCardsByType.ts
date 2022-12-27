import { groupBy, sortBy } from 'lodash'

const typeRegex = /(\w+)( —|$)/

const nonStandardTypes = [
  'Stickers',
  'Vanguard',
  'Plane',
  'Scheme',
  'Phenomenon',
  'Hero',
  'Conspiracy',
  'Dungeon'
]

export const typeOrder: Record<string, number> = {
  Creature: 0,
  Planeswalker: 1,
  Artifact: 2,
  Enchantment: 3,
  Instant: 4,
  Sorcery: 5,
  Land: 6,
  Other: 7
}

/**
 * Returns an ordered set of groups for standard card types.
 *
 * Cards with non-standard types are binned in an 'Other' group. This only
 * counts the last type listed on a card, so currently 'artifact creature's will
 * be binned with creatures. Only groups with cards will be included so index
 * position shouldn't be used.
 */
export const groupCardsByType = <T extends { type_line: string }>(
  cards: T[]
): { type: string; cards: T[] }[] => {
  const grouped = groupBy(cards, (card) => {
    const type = card.type_line?.match(typeRegex)?.[1]
    if (
      type == null ||
      nonStandardTypes.includes(type) ||
      typeOrder[type] == null
    ) {
      return 'Other'
    }
    return type
  })

  return sortBy(
    Object.keys(grouped).map((type) => ({
      type,
      cards: grouped[type]
    })),
    (group) => typeOrder[group.type]
  )
}
