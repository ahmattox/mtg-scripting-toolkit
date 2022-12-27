import { groupBy, sortBy } from 'lodash'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'

import { Color, log } from '../../utils/log'

/**
 * Count the number of unique new cards printed each year.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/new-cards-per-year
 *
 */
async function main() {
  const cards = mtg.uniqueFirstPrintings(
    await scryfall.fetchBulkData('default_cards')
  )

  const sets = await scryfall.fetchSets()

  const setsByID = sets.reduce((result, set) => {
    result[set.id] = {
      date: set.released_at,
      year: parseInt(set.released_at.split('-')[0])
    }

    return result
  }, {} as Record<string, { date: string; year: number }>)

  const groupedByYear = groupBy(cards, (card) => {
    return setsByID[card.set_id].year
  })

  const years = sortBy(Object.keys(groupedByYear), (y) => y)

  const result = years.map((year) => {
    const cardCount = groupedByYear[year].length

    return {
      year,
      cardCount
    }
  })

  const output = `year,cards\n${result
    .map((year) => `${year.year},${year.cardCount}`)
    .join('\n')}`

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
