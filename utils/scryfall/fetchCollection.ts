import { chunk } from 'lodash'

import * as config from './config'
import { List, Card, CardID, Error } from './types'

/**
 * Fetch card info for a collection of cards. Cards can be identified by name,
 * Scryfall ID, or set and collector number.
 *
 * Returns an array of Scryfall card objects and a separate array of identifiers
 * which weren't found.
 */
export async function fetchCollection(
  cardIdentifiers: CardID[],
  options: { abortSignal?: AbortSignal } = {}
): Promise<{
  cards: Card[]
  notFound?: CardID[]
  error?: string
}> {
  const { abortSignal } = options

  const batches = chunk(
    cardIdentifiers.map(formatIdentifier),
    config.fetchLimit
  )

  const cards: Card[] = []
  const notFound: CardID[] = []

  for (const batch of batches) {
    const data = {
      identifiers: batch
    }

    const response = await fetch(`${config.apiURL}/cards/collection`, {
      method: 'POST',
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: abortSignal
    })

    const json = (await response.json()) as List | Error

    if (json.object === 'error') {
      return { cards: [], error: json.details }
    }

    cards.push(...json.data)

    if (json.not_found) {
      notFound.push(...json.not_found)
    }
  }

  return {
    cards,
    notFound
  }
}

function normalizeName(name: string): string {
  return name.split('//')[0].trim()
}

function formatIdentifier(id: CardID) {
  if (typeof id === 'string') {
    return { name: normalizeName(id) }
  }

  if ('name' in id) {
    return { ...id, name: normalizeName(id.name) }
  }

  return id
}
