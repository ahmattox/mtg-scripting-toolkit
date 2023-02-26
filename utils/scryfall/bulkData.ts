import { Card } from './types'

import { cachedValue } from 'utils/cache'

type BulkDataType =
  | 'oracle_cards'
  | 'unique_artwork'
  | 'default_cards'
  | 'all_cards'
  | 'rulings'

interface BulkDataSets {
  object: 'list'
  data: {
    object: 'bulk_data'
    id: string
    type: BulkDataType
    updated_at: string
    uri: string
    name: string
    description: string
    compressed_size: number
    download_uri: string
    content_type: string
    content_encoding: string
  }[]
}

/**
 * Fetch the full bulk data sets from Scryfall.
 *
 * By default this fetches the 'oracle' data set which includes an object for
 * each unique card oracle id. The 'default_cards' data set includes every
 * unique printing for all cards.
 *
 * Note that the results are cached. Run with SKIP_CACHE=1 to refresh bulk data.
 *
 * Note this is typed to only allow oracle or default sets since I'm not sure
 * other sets have the same data structure.
 */
export async function fetchBulkData(
  type: 'oracle_cards' | 'default_cards' = 'oracle_cards'
) {
  return cachedValue(`scryfall-bulk-${type}`, async () => {
    const bulkDataObjects = (await fetch(
      `https://api.scryfall.com/bulk-data`
    ).then((response) => response.json())) as BulkDataSets

    const data = bulkDataObjects.data.find((object) => object.type === type)

    if (data == null) {
      throw new Error(`Unable to find bulk data set of type "${type}"`)
    }

    return (await fetch(data.download_uri).then((response) =>
      response.json()
    )) as Card[]
  })
}
