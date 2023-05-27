import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'

import { Color, log } from 'utils/log'

/**
 * Prints the list of card names in a Cube on Cube Cobra.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-list
 *
 */
async function main() {
  prompt.message = ''
  prompt.start()

  const { cubeLink } = await prompt.get([
    { name: 'cubeLink', message: 'Cube Cobra link or ID' }
  ])

  if (typeof cubeLink !== 'string') {
    throw new Error('Invalid cube link')
  }

  const cubeID = cubeCobra.cubeIDFromLink(cubeLink)

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid cube id')
  }

  const cards = await cubeCobra.fetchCubeList(cubeID)

  log(`id: ${cubeID}`)

  log('\n\n')
  log(cards.join('\n'), Color.blue)
  log('\n\n')
}

main()
