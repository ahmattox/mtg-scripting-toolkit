import * as config from './config'
import { Set } from './types'

/**
 * Fetch information about a set from Scryfall.
 */
export async function fetchSet(
  code: string,
  options: {
    abortSignal?: AbortSignal
  } = {}
): Promise<Set | null> {
  const { abortSignal } = options

  const url = `${config.apiURL}/sets/${code}`

  const response = await fetch(url, { signal: abortSignal })

  return await response.json()
}
