import yaml from 'yaml'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

/**
 * Generates Yaml for a given list of cards with the set and Scryfall ID from a
 * given cube. Specifically written to generate the cards mentioned page for
 * Lucky Paper podcast notes with the correct printings for episodes focused on
 * a specific Cube.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/card-list-match-cube-printings [path/to/text-file] [cube url]
 *
 */

async function main() {
  const cardListPath = process.argv[2]
  const cubeLink = process.argv[3]

  if (cardListPath == null || cubeLink == null) {
    throw new Error('Pass a path to a list of cards and a Cube Cobra URL')
  }

  const cubeID = cubeCobra.cubeIDFromLink(cubeLink)

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid link to Cube')
  }

  const cube = await cubeCobra.fetchCubeCards(cubeID)

  if (cube == null) {
    throw new Error('Error fetching Cube')
  }

  const cardList = mtg.parseCardList(cardListPath)

  const result = cardList.map((cardName) => {
    const emphasized = /\*\*$/.test(cardName) ? true : undefined
    cardName = cardName.replace(/\*\*$/, '')

    if (/^#/.test(cardName)) {
      return cardName
    }
    const card = cube.cards.find((card) => card.name === cardName)

    if (card != null) {
      return { name: card.name, set: card.set, id: card.id, emphasized }
    } else {
      return { name: cardName, emphasized }
    }
  })

  const output = yaml.stringify(result)

  log()
  log()
  log(output, Color.blue)
  log()
  log()
}

main()
