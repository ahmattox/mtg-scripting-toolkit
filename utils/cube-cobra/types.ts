/**
 * Types describing the shape of the JSON returned from the Cube Cobra API
 * endpoint. These have been determined experimentally and may not be perfectly
 * accurate.
 */

type Color = 'W' | 'U' | 'B' | 'R' | 'G'
type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'special'

export interface CubeCobraCard {
  cmc: number
  colorCategory: unknown
  finish: 'Non-foil' | 'Foil' | unknown
  isUnlimited: boolean
  rarity: Rarity | null
  status: 'Owned' | string
  tags: string[]
  type_line: string
  colors: Color[]
  cardID: string
  addedTmsp: number
  index: number
  board: 'mainboard' | 'maybeboard'
  details: {
    cubedWith: {
      top: string[]
      creatures: string[]
      spells: string[]
      other: string[]
    }
    draftedWith: {
      top: string[]
      creatures: string[]
      spells: string[]
      other: string[]
    }
    elo: number
    popularity: number
    cubeCount: number
    pickCount: number
    color_identity: Color[]
    set: string // 3 or 4 character set code
    set_name: string
    finishes: ('nonfoil' | 'foil')[]
    collector_number: string
    released_at: string
    reprint: boolean
    promo: boolean
    prices: {
      usd?: number | null
      usd_foil?: number | null
      usd_etched?: number | null
      eur?: number | null
      tix?: number | null
    }
    digital: boolean
    isToken: boolean
    border_color: string
    name: string
    name_lower: string
    full_name: string
    artist: string
    scryfall_uri: string
    rarity: Rarity
    oracle_text: string
    _id: string
    oracle_id: string
    cmc: number
    legalities: Record<string, 'legal' | 'not_legal' | 'banned'>
    parsed_cost: string[] // includes lower case colors, numerals, "split", and other symbols
    colors: Color[]
    type: string
    full_art: boolean
    language: string
    mtgo_id: number
    layout: string
    tcgplayer_id: number
    power: string
    toughness: string
    image_small: string
    image_normal: string
    art_crop: string
    colorcategory: 'w' | 'u' | 'b' | 'r' | 'g' | 'l' | 'c' | 'm'
  }
}

export interface CubeCobraUser {
  following: string[]
  theme: 'default' | 'dark' | unknown
  hideFeatures: boolean
  followedCubes: string[]
  imageName: string
  followedUsers: string[]
  roles: string[]
  usernameLower: string
  about: string
  image: {
    uri: string
    artist: string
    id: string
    imageName: string
  }
  hideTagColors: boolean
  username: string
  id: string
  patron: string
}

export interface CubeCobraCube {
  defaultSorts: string[]
  following: string[]
  shortId: string
  defaultFormat: number
  visibility: 'pu' | string
  imageName: string
  name: string
  date: number
  defaultStatus: 'Owned' | unknown
  keywords: string[]
  owner: CubeCobraUser
  id: string
  priceVisibility: 'pu' | unknown
  featured: boolean
  tags: string[]
  cardCount: number
  categoryOverride: string | unknown
  numDecks: number
  tagColors: {
    color: string
    tag: string
  }[]
  basics: string[]
  defaultPrinting: 'recent' | unknown
  disableAlerts: boolean
  formats: unknown[]
  description: string
  categoryPrefixes: string[]
  image: {
    uri: string
    artist: string
    id: string
    imageName: string
  }
  cards: {
    id: string
    mainboard: CubeCobraCard[]
    maybeboard: CubeCobraCard[]
  }
}
