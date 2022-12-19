import prompt from 'prompt'
import { kebabCase } from 'lodash'

import { Color, log } from '../utils/log'
import { fetchBulkData } from '../utils/scryfall/bulkData'

/**
 * Search the Scryfall bulk data set for a card by name. Built for debugging to
 * look at the data available for a card in the data set.
 *
 * Run with
 *
 *     yarn tsx ./scripts/search.ts
 *
 */
async function main() {
  prompt.message = ''
  prompt.start()

  const { cardName } = await prompt.get([
    { name: 'cardName', message: 'Card Name' }
  ])

  if (typeof cardName !== 'string') {
    throw new Error('Invalid card name')
  }

  const cards = await fetchBulkData('default_cards')

  const slug = kebabCase(cardName)

  const matchingCards = cards.filter((card) => kebabCase(card.name) === slug)

  if (matchingCards.length === 0) {
    log(`No card named: ${cardName} found`, Color.red)
    return
  }

  log('\n\n')
  log(JSON.stringify(matchingCards, null, 2), Color.blue)
  log('\n\n')
}

main()
