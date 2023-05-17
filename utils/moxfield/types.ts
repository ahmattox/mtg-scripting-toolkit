import * as Scryfall from '../scryfall/types'

/**
 * The deck structure returned from Moxfield's API.
 *
 * These types have been created based on example responses and are not
 * necessarily complete or entirely accurate.
 */
export interface Deck {
  id: string
  name: string
  description: string
  format: string
  visibility: 'unlisted' | string
  publicUrl: string
  publicId: string
  likeCount: number
  viewCount: number
  commentCount: number
  areCommentsEnabled: boolean
  isShared: boolean
  authorsCanEdit: boolean
  createdByUser: User
  authors?: User[]
  requestedAuthors?: unknown[]
  main: Card
  boards: {
    mainboard: Board
    sideboard: Board
    maybeboard: Board
    commanders: Board
    companions: Board
    signatureSpells: Board
    attractions: Board
    stickers: Board
    contraptions: Board
    planes: Board
  }
  version: number
  tokens?: Card[]
  hubs?: unknown[]
  createdAtUtc: string
  lastUpdatedAtUtc: string
  exportId: string
  authorTags: Record<string, string[]>
  isTooBeaucoup: boolean
  affiliates: {
    ck: string
    tcg: string
    csi: string
    ch: string
    cm: string
    scg: string
    ct: string
  }
  mainCardIdIsBackFace: boolean
  allowPrimerClone: boolean
  enableMultiplePrintings: boolean
  includeBasicLandsInPrice: boolean
  includeCommandersInPrice: boolean
  includeSignatureSpellsInPrice: boolean
  colors?: Color[]
  colorPercentages?: {
    white: number
    blue: number
    black: number
    red: number
    green: number
  }
  colorIdentity?: Color[]
  colorIdentityPercentages?: {
    white: number
    blue: number
    black: number
    red: number
    green: number
  }
  media?: unknown[]
}

export interface User {
  userName: string
  badges?: unknown[]
}

export interface Board {
  count: number
  cards: Record<string, BoardItem>
}

export interface BoardItem {
  quantity: number
  boardType: string
  finish: 'nonFoil' | 'foil'
  isFoil: boolean
  isAlter: boolean
  isProxy: boolean
  card: Card
  useCmcOverride: boolean
  useManaCostOverride: boolean
  useColorIdentityOverride: boolean
  excludedFromColor?: boolean
}

type Legality = 'not_legal' | 'legal'

type Color = 'W' | 'U' | 'B' | 'R' | 'G'

export interface Card {
  id: string
  uniqueCardId: string
  scryfall_id: string
  set: string // 3 or 4 letter set code
  set_name: string
  name: string
  set_type: Scryfall.SetType
  cn: string // collector number
  layout: Scryfall.CardLayout
  cmc: number
  type: string // a numeric id for a card type
  type_line: string
  oracle_text: string
  mana_cost: string
  power?: string
  toughness?: string
  loyalty: string
  colors?: Color[]
  color_indicator?: Color[]
  color_identity?: Color[]
  legalities: {
    standard: Legality
    future: Legality
    historic: Legality
    gladiator: Legality
    pioneer: Legality
    explorer: Legality
    modern: Legality
    legacy: Legality
    pauper: Legality
    vintage: Legality
    penny: Legality
    commander: Legality
    oathbreaker: Legality
    brawl: Legality
    historicbrawl: Legality
    alchemy: Legality
    paupercommander: Legality
    duel: Legality
    oldschool: Legality
    premodern: Legality
    predh: Legality
  }
  frame: string
  reserved: boolean
  digital: boolean
  foil: boolean // A printing for this card exists in foil
  nonfoil: boolean // A printing for this card exists in nonfoil
  etched: boolean
  glossy: boolean
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic' | string
  border_color: 'black' | string
  colorshifted: boolean
  flavor_text?: string
  lang: string
  latest: boolean
  has_arena_legal: boolean
  prices: {
    lastUpdatedAtUtc: string // e.g. "2023-05-11T08:04:15.079Z"
    usd?: number
    usd_foil?: number
    eur?: number
    eur_foil?: number
    tix?: number
    ck?: number
    ck_foil?: number
    ck_buy?: number
    ck_buy_foil?: number
    ck_buy_qty?: number
    ck_buy_foil_qty?: number
    csi?: number
    csi_foil?: number
    csi_buy?: number
    csi_buy_foil?: number
    csi_buy_qty?: number
    csi_buy_foil_qty?: number
  }
  card_faces?: {
    id: string
    name: string
    mana_cost: string
    type_line: string
    oracle_text: string
    colors: Color[] // the values for these fields seem to be missing on some cards
    color_indicator: Color[] // the values for these fields seem to be missing on some cards
    power: string
    toughness: string
    loyalty: string
  }[]
  artist: string
  promo_types?: string[]
  isArenaLegal: boolean
  reprint: boolean
  released_at: string
  has_multiple_editions: boolean
  edhrec_rank?: number
  multiverse_ids?: number[]
  cardHoarderUrl?: string
  cardKingdomUrl?: string
  cardKingdomFoilUrl?: string
  cardMarketUrl?: string
  tcgPlayerUrl?: string
  cardmarket_id?: number
  mtgo_id?: number
  tcgplayer_id?: number
  cardkingdom_id?: number
  cardkingdom_foil_id?: number
  coolStuffIncUrl?: string
  coolStuffIncFoilUrl?: string
  acorn: boolean
  isToken: boolean
  defaultFinish: 'nonFoil' | string
}
