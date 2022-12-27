import { groupBy, sortBy } from 'lodash'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'

import { Color, log } from '../../utils/log'

const cardTypes = [
  'Creature',
  'Planeswalker',
  'Artifact',
  'Enchantment',
  'Instant',
  'Sorcery',
  'Land'
]

/**
 * Count the distribution of card types among new cards printed each year.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/card-type-distribution
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

    const cardsByType = mtg.groupCardsByType(groupedByYear[year])

    return {
      year,
      cardCount,
      cardsByType
    }
  })

  const csvHeading = `year,cards,${cardTypes.join(',')}`
  const csvRows = result.map((year) => {
    const validTypeCount = year.cardsByType.reduce((result, group) => {
      if (cardTypes.includes(group.type)) {
        return result + group.cards.length
      }
      return result
    }, 0)
    return `${year.year},${validTypeCount},${cardTypes.map((type) => {
      const group = year.cardsByType.find((t) => t.type === type) ?? {
        type,
        cards: []
      }

      return group.cards.length / validTypeCount
    })}`
  })

  const output = `${csvHeading}\n${csvRows.join('\n')}`

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
