import * as scryfall from 'utils/scryfall'

import { apiURL, cubeIDPattern, cubeLinkPattern } from './config'
import { CubeCobraCube } from './types'

export const cubeIDFromLink = (cubeLink: null | string): string | null => {
  const trimmedLink = cubeLink?.trim()

  if (trimmedLink == null || trimmedLink.length === 0) {
    return null
  }

  if (trimmedLink.match(cubeIDPattern)) {
    return trimmedLink
  }

  return trimmedLink.match(cubeLinkPattern)?.groups?.cubeID ?? null
}

export function urlForCube(cubeID: string) {
  return `https://cubecobra.com/cube/overview/${cubeID}`
}

export async function fetchCube(cubeID: string): Promise<CubeCobraCube> {
  const url = `${apiURL}/cubeJSON/${cubeID}`

  const response = await fetch(url)

  return await response.json()
}

/**
 * Fetches the Scryfall representation of all cards in a cube (excluding
 * maybe board).
 */
export async function fetchCubeCobraCards(cubeID: string) {
  const cube = await fetchCube(cubeID)

  if (!cube?.cards || !cube?._id) {
    return null
  }

  const ids = cube.cards.map((card) => card.cardID)

  return await scryfall.fetchCollection(ids.map((id) => ({ id })))
}
