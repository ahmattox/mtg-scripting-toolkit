import { Dictionary, groupBy, sortBy } from 'lodash'
import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'

import { log } from 'utils/log'

/**
 * Prints grouped, formatted, JSON of a list from Cube Cobra. Specifically
 * structured for the card list component in Lucky Paper articles.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-list-json.ts
 *
 */

async function main() {
  prompt.message = ''
  prompt.start()

  const { cubeID } = await prompt.get([
    { name: 'cubeID', message: 'Cube Cobra Cube ID' }
  ])

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid Cube ID')
  }

  const cube = await cubeCobra.fetchCube(cubeID)

  if (typeof cube == null) {
    throw new Error('Failed to fetch cube')
  }

  const cards = cube.cards.mainboard

  const sortedCards = sortBy(cards, 'manaValue')

  const colorGroups = groupBy(sortedCards, (card) => {
    if (card.details.type === 'Land') {
      return 'l'
      // if (card.details.color_identity.length === 1) {
      //   return card.details.color_identity[0].toLowerCase()
      // }
      // if (card.details.color_identity.length > 1) {
      //   return 'm'
      // }
    }
    return card.details.colorcategory
  })

  const result = sortBy(
    Object.keys(colorGroups),
    (color) => colorGroupOrder[color]
  ).map((color) => {
    const group = colorGroups[color]

    const typeGroups = groupBy(group, (card) => {
      if (color === 'm' || color === 'l') {
        return card.details.color_identity.length > 2
          ? '3+'
          : card.details.color_identity.join('')
      }
      return (card.type_line ?? card.details.type ?? '').match(
        supertypePattern
      )?.[1]
    })

    const labelFor = (color: string, group: string, length: number) => {
      if (color === 'm' || color === 'l') {
        return multiColorLabels[group]
      }
      return length === 1 ? group : typeLabels[group]
    }

    const sections = sortBy(
      Object.keys(typeGroups),
      (type) => typeOrder[type]
    ).map((type) => {
      const typeGroup = typeGroups[type]
      const cards = sortBy(typeGroup, 'manaValue').map((card) => ({
        name: card.details.name,
        set: card.details.set
      }))
      return {
        label: labelFor(color, type, cards.length),
        cards
      }
    }, {} as Dictionary<{ name: string }[]>)

    return {
      label: colorGroupLabels[color],
      color: colorGroupColors[color],
      sections
    }
  }, [] as Decklist)

  log(JSON.stringify(result, null, 2))
}

main()

const supertypePattern = /(\w+)($| —.*$)/

type Decklist = {
  label: string
  color: 'w' | 'u' | 'b' | 'r' | 'g' | 'm' | 'c' | 'l'
  sections: {
    label: string
    cards: { name: string; set?: string }[]
  }[]
}[]

const colorGroupLabels: Record<string, string> = {
  w: 'White',
  u: 'Blue',
  b: 'Black',
  r: 'Red',
  g: 'Green',
  m: 'Multicolor',
  c: 'Colorless',
  l: 'Lands'
}

const colorGroupColors: Record<string, string> = {
  w: 'w',
  u: 'u',
  b: 'b',
  r: 'r',
  g: 'g',
  m: 'm',
  c: 'c',
  l: 'l'
}

const colorGroupOrder: Record<string, number> = {
  w: 0,
  u: 1,
  b: 2,
  r: 3,
  g: 4,
  m: 5,
  c: 6,
  l: 7
}

const typeOrder: Record<string, number> = {
  Creature: 0,
  Instant: 1,
  Sorcery: 2,
  Artifact: 3,
  Enchantment: 4,
  Planeswalker: 5
}

const typeLabels: Record<string, string> = {
  Creature: 'Creatures',
  Instant: 'Instants',
  Sorcery: 'Sorceries',
  Artifact: 'Artifacts',
  Enchantment: 'Enchantments',
  Planeswalker: 'Planeswalkers',
  Land: 'Lands'
}

const multiColorLabels: Record<string, string> = {
  GW: 'Selesnya',
  UW: 'Azorius',
  BU: 'Dimir',
  BR: 'Rakdos',
  GR: 'Gruul',
  BW: 'Orzhov',
  RU: 'Izzet',
  BG: 'Golgari',
  RW: 'Boros',
  GU: 'Simic',
  '3+': 'Multicolor'
}
