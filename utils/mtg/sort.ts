import { sortBy } from 'lodash'

export const colorOrder: Record<string, number> = {
  w: 1,
  u: 2,
  b: 3,
  r: 4,
  g: 5
}

export const colorIdentityOrder: Record<string, number> = {
  '': 0,
  w: 1,
  u: 2,
  b: 3,
  r: 4,
  g: 5,
  wu: 6,
  wb: 7,
  wr: 8,
  wg: 9,
  ub: 10,
  ur: 11,
  ug: 12,
  br: 13,
  bg: 14,
  rg: 15,
  wub: 16,
  wur: 17,
  wug: 18,
  wbr: 19,
  wbg: 20,
  wrg: 21,
  ubr: 22,
  ubg: 23,
  urg: 24,
  brg: 25,
  wubr: 26,
  wubg: 27,
  wurg: 28,
  wbrg: 29,
  ubrg: 30,
  wubrg: 31
}

/**
 * Normalize a color identity array into a consistently ordered, lower case
 * color string.
 */
export function normalizeColorIdentity(colors: string[]): string {
  return sortBy(colors, (c) => colorOrder[c.toLowerCase()])
    .join('')
    .toLowerCase()
}

/**
 * Sorts a set of card objects by color given a set of objects and a method to
 * get the colors as an array including ["w", "u", "b", "r", "g"] from each
 * item.
 */
export function byColor<T>(cards: T[], getColors: (card: T) => string[]): T[] {
  return sortBy(cards, (card) => {
    const colors = getColors(card)
    const colorPosition = colorIdentityOrder[normalizeColorIdentity(colors)]

    if (colorPosition == null) {
      throw new Error(`Invalid color: ${colors.join('')}`)
    }

    return colorPosition
  })
}

export const raritiesOrder: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  mythic: 3
}

/**
 * Sorts a set of card objects by rarity given a set of objects and a function
 * to get the rarity from each item. Rarities should be one of "common",
 * "uncommon", "rare", or "mythic".
 */
export function byRarity<T>(cards: [], getRarity: (card: T) => string): T[] {
  return sortBy(cards, (card) => {
    return raritiesOrder[getRarity(card).toLowerCase()]
  })
}
