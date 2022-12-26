import { sum } from 'lodash'

import * as scryfall from '../scryfall'

import { wordCount } from '../wordCount'

function parseNumber(value: string | null | undefined): number {
  if (value == null) {
    return 0
  }
  const parsed = parseInt(value)
  return isNaN(parsed) ? 0 : parsed
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
export function oracleText(card: scryfall.Card) {
  if (card.oracle_text != null) {
    return card.oracle_text
  }
  if (card.card_faces != null) {
    return card.card_faces.map((face) => face.oracle_text).join('\n//\n')
  }
  return ''
}

/**
 * Total word count in the rules text of a card.
 */
export function oracleWordCount(card: scryfall.Card) {
  return wordCount(oracleText(card))
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
