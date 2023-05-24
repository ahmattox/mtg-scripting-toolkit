import * as scryfall from 'utils/scryfall'

export interface Combo {
  cards: scryfall.Card[]
  legalities: Record<scryfall.Format, 'legal' | 'not_legal'>
  cardNames: string[]
  colorIdentity?: string
  prerequisites?: string
  steps?: string
  results?: string[]
  variantIDs?: string
}
