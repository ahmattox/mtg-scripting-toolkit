import { flatMap } from 'lodash'

import * as scryfall from '../scryfall'

import { colorGroup, ColorGroup } from './colorGroup'

export interface SimplifiedCard {
  name: string
  scryfallID: string
  manaCost: string
  manaValue: number
  colors: scryfall.Color[]
  colorIdentity: scryfall.Color[]
  colorGroup: ColorGroup
  typeLine: string
  rarity: string
  imageURIs: Record<string, string>
  oracleText?: string
  power?: string
  toughness?: string
  loyalty?: string
  flavorText?: string
  artist: string
  cardFaces?: CardFace[]
}

export interface CardFace {
  name: string
  manaCost: string
  typeLine: string
  oracleText?: string
  colors: string[]
  power?: string
  toughness?: string
  loyalty?: string
  flavorText?: string
  artist: string
  imageURIs: Record<string, string>
}

/**
 * Simplify a list of cards fetched from scryfall. Drops a lot of data that's
 * unneeded and merges some attributes from multi-part cards in a way that's
 * simpler to use.
 */
export function simplifyCards(objects: scryfall.Card[]): SimplifiedCard[] {
  return objects.map(simplifyCard)
}

export function simplifyCard(object: scryfall.Card): SimplifiedCard {
  const colors = object.colors
    ? object.colors
    : object.card_faces
    ? flatMap(object.card_faces, (face) => face.colors)
    : []

  const typeLine = object.card_faces
    ? flatMap(object.card_faces, (face) => face.type_line).join(' ')
    : object.type_line

  const cardFaces = object.card_faces?.map((face) => ({
    name: face.name,
    manaCost: face.mana_cost,
    typeLine: face.type_line,
    oracleText: face.oracle_text,
    colors: face.colors,
    power: face.power,
    toughness: face.toughness,
    loyalty: face.loyalty,
    flavorText: face.flavor_text,
    artist: face.artist,
    imageURIs: face.image_uris
  }))

  return {
    name: object.name,
    scryfallID: object.id,
    manaCost: object.mana_cost,
    manaValue: object.cmc,
    colors,
    colorIdentity: object.color_identity,
    colorGroup: colorGroup(colors, typeLine),
    typeLine,
    rarity: object.rarity,
    imageURIs: object.image_uris,
    oracleText: object.oracle_text,
    power: object.power,
    toughness: object.toughness,
    loyalty: object.loyalty,
    flavorText: object.flavor_text,
    artist: object.artist,
    cardFaces
  }
}
