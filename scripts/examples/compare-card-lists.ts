import { Color, log } from 'utils/log'

import * as mtg from 'utils/mtg'

/**
 * Compare two lists of Magic card names. Prints the list of cards included in
 * both lists, and then unique to each list.
 *
 * Pass two paths to text files with lists of cards.
 *
 * Parameters could be replaced with fetching lists from other sources. Checks
 * for exact matches of card names. If names are hand written or coming from
 * different sources, you could run the lists through the card spellcheck
 * function first to ensure they're compared correctly.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/compare-card-lists [path/to/text-file-A] [path/to/text-file-B]
 *
 */

async function main() {
  const cardsAPath = process.argv[2]
  const cardsBPath = process.argv[3]

  if (cardsAPath == null || cardsBPath == null) {
    throw new Error('Pass two paths to lists of cards to compare.')
  }

  const comparison = mtg.compareLists(
    mtg.parseCardList(cardsAPath),
    mtg.parseCardList(cardsBPath)
  )

  log()
  log(`${comparison.shared.length} cards in both lists`, Color.blue)
  log(`${comparison.uniqueToA.length} cards in only list A`, Color.green)
  log(`${comparison.uniqueToB.length} cards in only list B`, Color.magenta)
  log()

  log()
  log()
  log(`In Both Lists:`)
  log()
  log(comparison.shared.join('\n'), Color.blue)

  log()
  log()
  log(`In Only List A:`)
  log()
  log(comparison.uniqueToA.join('\n'), Color.green)

  log()
  log()
  log(`In Only List B:`)
  log()
  log(comparison.uniqueToB.join('\n'), Color.magenta)

  log()
}

main()
