import { groupBy, sortBy, sum } from 'lodash'

import * as scryfall from '../utils/scryfall'
import * as mtg from '../utils/mtg'

import { wordCount } from '../utils/wordCount'
import { Color, log } from '../utils/log'

function wordsOnCard(card: scryfall.Card) {
  if (card.oracle_text != null) {
    return wordCount(card.oracle_text)
  } else if (card.card_faces != null) {
    return sum(card.card_faces.map((face) => wordCount(face.oracle_text)))
  }
  return 0
}

function flavorTextWordsOnCard(card: scryfall.Card) {
  return card.flavor_text != null ? wordCount(card.flavor_text) : 0
}

/**
 * Run with
 *
 *     yarn run tsx ./scripts/bulk-data-analysis/count-card-text-by-year
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

  const nonVanillaCards = cards.filter((card) => {
    return card.oracle_text !== ''
  })

  const groupedByYear = groupBy(nonVanillaCards, (card) => {
    return setsByID[card.set_id].year
  })

  const years = sortBy(Object.keys(groupedByYear), (y) => y)

  const result = years.map((year) => {
    const cardCount = groupedByYear[year].length
    const totalWords = sum(groupedByYear[year].map(wordsOnCard))
    const totalFlavorTextWords = sum(
      groupedByYear[year].map(flavorTextWordsOnCard)
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
