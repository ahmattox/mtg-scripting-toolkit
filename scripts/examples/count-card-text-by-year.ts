import { groupBy, sortBy, sum } from 'lodash'

import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

/**
 * Run with
 *
 *     yarn run tsx ./scripts/examples/count-card-text-by-year
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
    const totalWords = sum(groupedByYear[year].map(mtg.card.textWordCount))
    const totalFlavorTextWords = sum(
      groupedByYear[year].map(mtg.card.flavorTextWordCount)
    )

    return {
      year,
      cardCount,
      totalWords,
      averageWordsPerCard: totalWords / cardCount,
      averageFlavorWordsPerCard: totalFlavorTextWords / cardCount
    }
  })

  const output = `year,cards,words,words per card,flavor words per card\n${result
    .map(
      (year) =>
        `${year.year},${year.cardCount},${year.totalWords},${year.averageWordsPerCard},${year.averageFlavorWordsPerCard}`
    )
    .join('\n')}`

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
