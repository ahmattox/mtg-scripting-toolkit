import * as config from './config'
import { Set } from './types'

/**
 * Fetch list of all sets available on Scryfall.
 */
export async function fetchSets(
  options: {
    abortSignal?: AbortSignal
  } = {}
): Promise<Set[]> {
  const { abortSignal } = options

  const url = `${config.apiURL}/sets`

  const response = await fetch(url, { signal: abortSignal })

  return (await response.json())['data']
}
