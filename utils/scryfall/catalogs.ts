import * as config from './config'

type CatalogType =
  | 'card-names'
  | 'artist-names'
  | 'word-bank'
  | 'creature-types'
  | 'planeswalker-types'
  | 'land-types'
  | 'artifact-types'
  | 'enchantment-types'
  | 'spell-types'
  | 'powers'
  | 'toughnesses'
  | 'loyalties'
  | 'watermarks'
  | 'keyword-abilities'
  | 'keyword-actions'
  | 'ability-words'

interface Options {
  abortSignal?: AbortSignal
}

async function fetchCatalog(catalogType: CatalogType, options: Options = {}) {
  const { abortSignal } = options

  const url = `${config.apiURL}/catalog/${catalogType}`

  const response = await fetch(url, { signal: abortSignal })

  const result = (await response.json()) as {
    object: 'catalog'
    uri: string
    total_values: number
    data: string[]
  }

  return result.data
}

export async function fetchCardNames(options?: Options) {
  return fetchCatalog('card-names', options)
}

export async function fetchArtistNames(options?: Options) {
  return fetchCatalog('artist-names', options)
}

export async function fetchWordBank(options?: Options) {
  return fetchCatalog('word-bank', options)
}

export async function fetchCreatureTypes(options?: Options) {
  return fetchCatalog('creature-types', options)
}

export async function fetchPlaneswalkerTypes(options?: Options) {
  return fetchCatalog('planeswalker-types', options)
}

export async function fetchLandTypes(options?: Options) {
  return fetchCatalog('land-types', options)
}

export async function fetchArtifactTypes(options?: Options) {
  return fetchCatalog('artifact-types', options)
}

export async function fetchEnchantmentTypes(options?: Options) {
  return fetchCatalog('enchantment-types', options)
}

export async function fetchSpellTypes(options?: Options) {
  return fetchCatalog('spell-types', options)
}

export async function fetchPowers(options?: Options) {
  return fetchCatalog('powers', options)
}

export async function fetchToughnesses(options?: Options) {
  return fetchCatalog('toughnesses', options)
}

export async function fetchLoyalties(options?: Options) {
  return fetchCatalog('loyalties', options)
}

export async function fetchWatermarks(options?: Options) {
  return fetchCatalog('watermarks', options)
}

export async function fetchKeywordAbilities(options?: Options) {
  return fetchCatalog('keyword-abilities', options)
}

export async function fetchKeywordActions(options?: Options) {
  return fetchCatalog('keyword-actions', options)
}

export async function fetchAbilityWords(options?: Options) {
  return fetchCatalog('ability-words', options)
}
