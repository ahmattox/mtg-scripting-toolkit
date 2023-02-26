import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'
import { cachedValue } from 'utils/cache'

/**
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-csv [optional cube id or link]
 *
 * Fetches a cube from Cube Cobra and prints a sorted CSV of all colors. This is
 * tailed to printing the list necessary for the templates linked in this
 * article:
 *
 * https://luckypaper.co/articles/cube-in-the-time-of-covid-with-rotisserie-draft/
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

  const sortedCards = mtg.magicSort(cards)

  console.log(`id: ${cubeID}`)

  log('\n\n')
  log(
    sortedCards
      .map((card) => {
        const ci =
          card.color_identity.length === 0
            ? 'C'
            : card.color_identity.join('').toUpperCase()
        return `"${card.name}","${card.type_line}",${ci}`
      })
      .join('\n'),
    Color.blue
  )
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
