import prompt from 'prompt'

import * as moxfield from 'utils/moxfield'

import { Color, log } from 'utils/log'

/**
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/moxfield-list [optional cube id or link]
 *
 */
async function main() {
  const deckLink = await getDeckLink()

  const deck = await moxfield.getDeck(deckLink)

  if (deck == null) {
    throw new Error('No Deck Found')
  }

  const cardNames = moxfield.cardNamesFromDeck(deck)

  log('\n\n')
  log(cardNames.join('\n'), Color.blue)
  log('\n\n')
}

async function getDeckLink() {
  const linkArgument = process.argv[2]

  if (linkArgument != null) {
    return linkArgument.trim()
  }

  prompt.message = ''
  prompt.start()

  const { link } = await prompt.get([
    { name: 'link', message: 'Link to deck on Moxfield' }
  ])

  if (typeof link !== 'string') {
    throw new Error('Invalid link')
  }

  return link
}

main()
