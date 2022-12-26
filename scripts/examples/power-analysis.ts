import { groupBy, sortBy } from 'lodash'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'

import { Color, log } from '../../utils/log'

/**
 * Run with
 *
 *     yarn run tsx ./scripts/examples/power-analysis
 *
 */
async function main() {
  const cards = mtg.uniqueFirstPrintings(
    await scryfall.fetchBulkData('default_cards')
  )

  const creatureCards = cards.filter(
    (card) =>
      card.type_line.includes('Creature') ||
      card.card_faces?.some((face) => face.type_line?.includes('Creature'))
  )

  const sets = await scryfall.fetchSets()

  const setsByID = sets.reduce((result, set) => {
    result[set.id] = {
      date: set.released_at,
      year: parseInt(set.released_at.split('-')[0])
    }

    return result
  }, {} as Record<string, { date: string; year: number }>)

  const groupedByYear = groupBy(creatureCards, (card) => {
    return setsByID[card.set_id].year
  })

  const years = sortBy(Object.keys(groupedByYear), (y) => y)

  const result = years.map((year) => {
    const cardCount = groupedByYear[year].length
    const totalPower = groupedByYear[year].reduce((result, card) => {
      return result + mtg.cardAttributes.totalPower(card)
    }, 0)
    const totalToughness = groupedByYear[year].reduce((result, card) => {
      return result + mtg.cardAttributes.totalToughness(card)
    }, 0)

    return {
      year,
      cardCount,
      totalPower,
      totalToughness,
      averagePower: totalPower / cardCount,
      averageToughness: totalToughness / cardCount
    }
  })

  const output = `year,cards,power,toughness,averagePower,averageToughness\n${result
    .map(
      (year) =>
        `${year.year},${year.cardCount},${year.totalPower},${year.totalToughness},${year.averagePower},${year.averageToughness}`
    )
    .join('\n')}`

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
