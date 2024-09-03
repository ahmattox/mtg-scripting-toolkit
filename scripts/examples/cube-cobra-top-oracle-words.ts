import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

import { log, Color } from 'utils/log'
import { cachedValue } from 'utils/cache'
import { padStart, sortBy } from 'lodash'

/**
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-top-oracle-words [optional cube id or link]
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

  const words = cards.reduce((result, card) => {
    const cardWords = mtg.card
      .text(card)
      .replace(/\(.*?\)/g, '')
      ?.split(/[ \n]/)
      .map((word) => word.replace(/[.,'":]/g, '').toLowerCase())
      .filter((word) => word.length > 5)

    result.push(...cardWords)

    return result
  }, [] as string[])

  const wordCounts = words.reduce((result, word) => {
    result[word] = result[word] == null ? 1 : result[word] + 1

    return result
  }, {} as Record<string, number>)

  const sortedCounts = sortBy(
    Object.entries(wordCounts),
    ([, count]) => count * -1
  )

  log('')
  for (const [word, count] of sortedCounts.slice(0, 100)) {
    log(`${padStart(count.toString(), 5, ' ')} - ${word}`, Color.blue)
  }
  log('')
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
