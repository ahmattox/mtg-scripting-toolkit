import { sum } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { wordCount } from 'utils/wordCount'

export { types } from './cardTypes'

function parseNumber(value: string | null | undefined): number {
  if (value == null) {
    return 0
  }
  const parsed = parseInt(value)
  return isNaN(parsed) ? 0 : parsed
}

export function isNamed(card: scryfall.Card, name: string) {
  const names = [
    card.name.toLowerCase(),
    ...(card.card_faces?.map((face) => face.name.toLowerCase()) ?? [])
  ]
  return names.includes(name.toLowerCase())
}

export function power(card: scryfall.Card) {
  if (card.power != null) {
    return parseNumber(card.power)
  }
  if (card.card_faces != null) {
    return parseNumber(card.card_faces[0]?.power)
  }
  return 0
}

export function toughness(card: scryfall.Card) {
  if (card.toughness != null) {
    return parseNumber(card.toughness)
  }
  if (card.card_faces != null) {
    return parseNumber(card.card_faces[0]?.toughness)
  }
  return 0
}

/**
 * The total power of a card. If a card has multiple faces or parts that are
 * both creatures, the sum of all powers is returned.
 */
export function totalPower(card: scryfall.Card) {
  if (card.power != null) {
    return parseNumber(card.power)
  }
  if (card.card_faces != null) {
    return sum(card.card_faces.map((face) => parseNumber(face.power)))
  }
  return 0
}

/**
 * The total toughness of a card. If a card has multiple faces or parts that are
 * both creatures, the sum of all toughness is returned.
 */
export function totalToughness(card: scryfall.Card) {
  if (card.toughness != null) {
    return parseNumber(card.toughness)
  }
  if (card.card_faces != null) {
    return sum(card.card_faces.map((face) => parseNumber(face.toughness)))
  }
  return 0
}

/**
 * Complete oracle text for a card. Joins the next of multi-part cards with '//'
 * on a new line in between.
 */
export function text(card: scryfall.Card) {
  if (card.oracle_text != null) {
    return card.oracle_text
  }
  if (card.card_faces != null) {
    return card.card_faces.map((face) => face.oracle_text).join('\n//\n')
  }
  return ''
}

/**
 * Test if a cards rules text includes a string. Case insensitive.
 */
export function textIncludes(card: scryfall.Card, value: string) {
  return text(card).toLowerCase().includes(value.toLowerCase())
}

/**
 * Test if a cards type line includes a string. Case insensitive.
 */
export function typeIncludes(card: scryfall.Card, value: string) {
  return card.type_line.toLowerCase().includes(value.toLowerCase())
}

/**
 * Total word count in the rules text of a card.
 */
export function textWordCount(card: scryfall.Card) {
  return wordCount(text(card))
}

/**
 * Total word count of flavor text on a card.
 */
export function flavorTextWordCount(card: scryfall.Card) {
  if (card.card_faces != null) {
    return sum(
      card.card_faces.map((face) =>
        face.flavor_text != null ? wordCount(face.flavor_text) : 0
      )
    )
  }
  return card.flavor_text != null ? wordCount(card.flavor_text) : 0
}
