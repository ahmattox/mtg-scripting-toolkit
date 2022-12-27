import prompt from 'prompt'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'
import * as cubeCobra from '../../utils/cube-cobra'

import { Color, log } from '../../utils/log'

/**
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-list-first-printing
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

  const cubeCardNames = await cubeCobra.fetchCubeList(cubeID)

  const allCards = mtg.uniqueFirstPrintings(
    await scryfall.fetchBulkData('default_cards')
  )

  const cubeCards = cubeCardNames.map((cardName) => {
    const foundCard = allCards.find((card) => mtg.card.isNamed(card, cardName))

    if (!foundCard) {
      log(`No card found with name "${cardName}"`, Color.red)
    }

    return foundCard
  })

  const csvHeading = `name,scryfallID,releaseDate`
  const csvRows = cubeCards.map((card) => {
    return `"${card?.name ?? 'Card not found'}",${card?.id ?? ''},${
      card?.released_at ?? ''
    }`
  })
  const output = `${csvHeading}\n${csvRows.join('\n')}`

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
