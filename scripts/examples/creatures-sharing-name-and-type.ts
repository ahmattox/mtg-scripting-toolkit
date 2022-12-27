import { kebabCase } from 'lodash'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'

import { Color, log } from '../../utils/log'
import { permutations } from '../../utils/collections'

/**
 * Finds all creature types who's name and subtypes are the same.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/creatures-sharing-name-and-type
 *
 */

async function main() {
  const cards = await scryfall.fetchBulkData()

  // find cards where the subtype is equivalent to it's name.
  const filteredCards = cards.filter((card) => {
    if (card.layout === 'token') {
      return false
    }

    const subtypes = card.type_line.split(' — ')[1]
    if (subtypes == null) {
      return false
    }

    const permutedTypeSlugs = permutations(subtypes.split(' ')).map((s) =>
      kebabCase(s.join(' '))
    )

    return permutedTypeSlugs.includes(kebabCase(card.name))
  })

  const sortedCards = mtg.sort.byColor(
    filteredCards,
    (card) => card.color_identity
  )

  log()
  log(`Found ${sortedCards.length} cards`, Color.blue)
  log()

  log(sortedCards.map((card) => card.name).join('\n'), Color.blue)
  log()
}

main()
