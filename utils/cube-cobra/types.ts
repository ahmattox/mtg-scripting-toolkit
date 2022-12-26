/**
 * Types describing the shape of the JSON returned from the Cube Cobra API
 * endpoint. These have been determined experimentally and may not be perfectly
 * accurate.
 */

export interface CubeCobraCard {
  cmc: number
  colorCategory: string
  finish: string
  index: unknown | null
  isUnlimited: boolean
  rarity: unknown
  status: 'Owned' | string
  tags: string[]
  type_line: string
  colors: string[]
  _id: string
  cardID: string
  addedTmsp: string
}

export interface CubeCobraCube {
  _id: string
  isListed: boolean
  privatePrices: boolean
  isFeatured: boolean
  decks: string[]
  default_sorts: unknown
  cards: CubeCobraCard[]
  tag_colors: unknown[]
  shortID: string
  name: string
  owner: string
  image_uri: string
  image_name: string
  image_artist: string
  description: string
  owner_name: string
  date_updated: string
  updated_string: string
  type: string
  card_count: number
  numDecks: number
  descriptionhtml: unknown
  users_following: string[]
  categoryOverride: string
  categoryPrefixes: unknown[]
  draft_formats: unknown[]
  maybe: CubeCobraCard[]
  tags: string[]
  overrideCategory: boolean
  defaultPrinting: string
  defaultStatus: string
  defaultDraftFormat: number
  disableNotifications: boolean
  basics: string[]
  useCubeElo: boolean
  schemaVersion: number
  cardOracles: string[]
  categories: string[]
  keywords: string[]
  isPrivate: boolean
}
