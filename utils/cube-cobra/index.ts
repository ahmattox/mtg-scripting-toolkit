import * as scryfall from 'utils/scryfall'

import { apiURL, cubeIDPattern, cubeLinkPattern } from './config'
import { CubeCobraCube } from './types'

/**
 * Returns the ID of a Cube on Cube Cobra given either the ID or a link to any
 * page for the Cube on Cube Cobra. This doesn't do any normalizing or fetching
 * from Cube Cobra, but just looks for the pattern of the ID from a URL string.
 */
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

/**
 * URL for the overview page of a Cube with a given ID.
 */
export function urlForCube(cubeID: string) {
  return `https://cubecobra.com/cube/overview/${cubeID}`
}

/**
 * Fetches the list of card names in a Cube with a given ID from Cube Cobra.
 */
export async function fetchCubeList(cubeID: string): Promise<string[]> {
  const url = `${apiURL}/cubelist/${cubeID}`

  const response = await fetch(url)

  const lines = (await response.text()).split('\n')

  return lines
}

/**
 * Fetches the JSON representation of a Cube from Cube Cobra. Note that this
 * endpoint doesn't include card names but Scryfall IDs and some customizable
 * attributes. To get the card names, use `fetchCubeList` or `fetchCubeCards`,
 * which fetches full details from Scryfall.
 */
export async function fetchCube(cubeID: string): Promise<CubeCobraCube> {
  const url = `${apiURL}/cubeJSON/${cubeID}`

  const response = await fetch(url)

  return await response.json()
}

/**
 * Fetches the Scryfall representation of all cards in a cube (excluding
 * maybe board).
 */
export async function fetchCubeCards(cubeID: string) {
  const cube = await fetchCube(cubeID)

  if (!cube?.cards || !cube?._id) {
    return null
  }

  const ids = cube.cards.map((card) => card.cardID)

  return await scryfall.fetchCollection(ids.map((id) => ({ id })))
}
