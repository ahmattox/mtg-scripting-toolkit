import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

/**
 * The average number of words per card for each 'main' set.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/wordiness-by-set
 *
 */
async function main() {
  const sets = await scryfall.fetchSets()

  const mainSets = mtg.filterMainSets(sets)

  const bulkData = await scryfall.fetchBulkData('default_cards')

  const result = mainSets.map((set) => {
    const cards = bulkData.filter((card) => card.set === set.code)

    const averageWordCount =
      cards.reduce(
        (totalWordCount, card) => totalWordCount + mtg.card.textWordCount(card),
        0
      ) / cards.length

    return `"${set.name}",${cards.length},${averageWordCount}`
  })

  log()
  log()
  log(result.join('\n'), Color.green)
  log()
  log()
}

main()
