import { uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { Color, log } from 'utils/log'

/**
 * Get the unique set of "promo types" across all cards in the Scryfall
 * database.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/unique-promo-types
 *
 */
async function main() {
  const cards = await scryfall.fetchBulkData('default_cards')

  const uniquePromoTypes = uniq(cards.flatMap((card) => card.promo_types ?? []))

  log()
  log()
  log(uniquePromoTypes.join('\n'), Color.blue)
  log()
  log()
}

main()
