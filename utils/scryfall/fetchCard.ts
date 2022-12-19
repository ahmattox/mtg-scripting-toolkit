import * as config from './config'
import { FetchCardID, Card, Error } from './types'

function urlForCard(options: FetchCardID): string {
  if ('id' in options && options.id != null) {
    return `${config.apiURL}/cards/${options.id}`
  }

  const params = new URLSearchParams({
    fuzzy: (options as { name: string; set: string | null }).name
      .trim()
      .toLowerCase()
  })

  if (options.set != null) {
    params.append('set', options.set.trim().toLowerCase())
  }

  return `${config.apiURL}/cards/named?${params.toString()}`
}

export async function fetchCard(
  options: FetchCardID & {
    abortSignal?: AbortSignal
  }
): Promise<Card | Error | null> {
  const { abortSignal, ...cardOptions } = options

  const url = urlForCard(cardOptions)

  const response = await fetch(url, { signal: abortSignal })

  return (await response.json()) as Card
}
