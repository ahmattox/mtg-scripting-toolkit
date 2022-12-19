import { List, Card } from './types'
import * as config from './config'

type SortOrder =
  | 'name'
  | 'set'
  | 'released'
  | 'rarity'
  | 'color'
  | 'usd'
  | 'tix'
  | 'eur'
  | 'cmc'
  | 'power'
  | 'toughness'
  | 'edhrec'
  | 'penny'
  | 'artist'
  | 'review'

type SortDirection = 'auto' | 'asc' | 'desc'

type RollupMode = 'cards' | 'art' | 'prints'

/**
 * Returns a list of Scryfall cards for a query. The query can include any
 * attributes formatted like a Scryfall search.
 *
 * Returns one 'page' of results by default. Provide the 'maxPage' option to
 * continue fetching results if present.
 */
export async function search(
  query: string,
  options: {
    maxPages?: number
    order?: SortOrder
    direction?: SortDirection
    includeExtras?: boolean
    unique?: RollupMode
    abortSignal?: AbortSignal
  } = {}
): Promise<Card[]> {
  const {
    maxPages = 1,
    order,
    direction,
    includeExtras,
    unique,
    abortSignal
  } = options

  const params = new URLSearchParams({
    q: query
  })

  if (order != null) {
    params.append('order', order)
  }

  if (direction != null) {
    params.append('dir', direction)
  }

  if (includeExtras != null) {
    params.append('include_extras', includeExtras ? 'true' : 'false')
  }

  if (unique != null) {
    params.append('unique', unique)
  }

  let url: string | undefined = `${
    config.apiURL
  }/cards/search?${params.toString()}`

  let result: Card[] = []
  let pageIndex = 0

  while (url != null && pageIndex < maxPages) {
    const response = await fetch(url, { signal: abortSignal })
    const json = (await response.json()) as List

    if (json.data != null) {
      result = [...result, ...json.data]
    }

    url = json.next_page
    pageIndex++
  }

  return result
}
