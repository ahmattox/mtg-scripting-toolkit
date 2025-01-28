import { omit } from 'lodash'
import prompt from 'prompt'
import yaml from 'yaml'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'

/**
 * Generates YAML or CSV for a given list of cards with the set and Scryfall ID
 * from a given cube. Specifically written to generate the cards mentioned page
 * for Lucky Paper podcast notes with the correct printings for episodes focused
 * on a specific Cube.
 *
 * Optionally pass the path to a file with a list of cards, the cube url, and
 * format, or you'll be prompted for them.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/card-list-match-cube-printings [path/to/text-file] [cube url] [csv|yml]
 *
 */

async function main() {
  prompt.override = removeEmptyKeys({
    filePath: process.argv[2],
    cubeURL: process.argv[3],
    outputFormat: process.argv[4]
  })

  const { filePath, cubeURL, outputFormat } = await prompt.get([
    {
      name: 'filePath',
      description: 'Path to card list file'
    },
    {
      name: 'cubeURL',
      description: 'Cube Cobra URL'
    },
    {
      name: 'outputFormat',
      description: 'Output format (csv, yml)',
      default: 'yml'
    }
  ])

  if (
    typeof filePath != 'string' ||
    typeof cubeURL != 'string' ||
    typeof outputFormat != 'string'
  ) {
    throw new Error('Invalid configuration')
  }

  if (outputFormat != 'csv' && outputFormat != 'yml') {
    throw new Error('Invalid output type')
  }

  const cubeID = cubeCobra.cubeIDFromLink(cubeURL)

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid link to Cube')
  }

  const cube = await cubeCobra.fetchCubeCards(cubeID)

  if (cube == null) {
    throw new Error('Error fetching Cube')
  }

  const cardList = mtg.parseCardList(filePath.trim())

  const result = cardList.map((cardName) => {
    const emphasized = /\*\*$/.test(cardName) ? true : undefined
    cardName = cardName.replace(/\*\*$/, '')

    if (/^#/.test(cardName)) {
      return cardName
    }

    const card = cube.cards.find((card) => mtg.card.isNamed(card, cardName))

    if (card != null) {
      return { name: card.name, set: card.set, id: card.id, emphasized }
    } else {
      return { name: cardName, emphasized }
    }
  })

  const output = formatOutput(result, outputFormat)

  log()
  log()
  log(output, Color.blue)
  log()
  log()
}

function formatOutput(
  cards: (
    | string
    | {
        name: string
        emphasized?: boolean
        set?: string
        id?: string
      }
  )[],
  format: 'csv' | 'yml'
) {
  if (format === 'yml') {
    return yaml.stringify(cards)
  }

  return [
    'name,set,id',
    ...cards.map((card) => {
      if (typeof card === 'string') {
        return `${card},,`
      }
      return `"${card.name}",${card.set || ''},${card.id || ''}`
    })
  ].join('\n')
}

function removeEmptyKeys(object: any) {
  const emptyKeys = Object.keys(object).filter((key) => object[key] == null)

  return omit(object, emptyKeys)
}

main()
