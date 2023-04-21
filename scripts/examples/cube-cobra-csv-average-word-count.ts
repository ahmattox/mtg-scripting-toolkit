import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'
import { cachedValue } from 'utils/cache'

/**
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-csv-average-word-count [optional cube id or link]
 *
 */
async function main() {
  const cubeLink = await getCubeLink()

  const cubeID = cubeCobra.cubeIDFromLink(cubeLink)

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid cube id')
  }

  const cards = await cachedValue(`cube-cards-${cubeID}`, async () => {
    return (await cubeCobra.fetchCubeCards(cubeID))?.cards
  })

  if (cards == null) {
    throw new Error('Failed to fetch cards for the Cube')
  }

  console.log(`id: ${cubeID}`)

  const averageWordCount =
    cards.reduce((total, card) => total + mtg.card.textWordCount(card), 0) /
    cards.length

  log('\n\n')
  log(`Cube: "${cubeID}"`, Color.blue)
  log(`Cards: ${cards.length}`, Color.blue)
  log(`Average Word Count: ${averageWordCount}`, Color.blue)
  log('\n\n')
}

async function getCubeLink() {
  const cubeLinkArgument = process.argv[2]

  if (cubeLinkArgument != null) {
    return cubeLinkArgument.trim()
  }

  prompt.message = ''
  prompt.start()

  const { cubeLink } = await prompt.get([
    { name: 'cubeLink', message: 'Cube Cobra link or ID' }
  ])

  if (typeof cubeLink !== 'string') {
    throw new Error('Invalid cube link')
  }

  return cubeLink
}

main()
