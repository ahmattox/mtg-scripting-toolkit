import { compact, groupBy, sortBy } from 'lodash'
import prompt from 'prompt'

import * as cubeCobra from 'utils/cube-cobra'

import { log, Color } from 'utils/log'

/**
 * Generates a checklist for a Cube fetched from Cube Cobra sorted by
 * color/land/multicolor and alphabetically by name.
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/cube-cobra-cube-checklist.ts
 *
 */

async function main() {
  prompt.message = ''
  prompt.start()

  const { cubeID } = await prompt.get([
    { name: 'cubeID', message: 'Cube Cobra Cube ID' }
  ])

  if (typeof cubeID !== 'string') {
    throw new Error('Invalid Cube ID')
  }

  const cards = (await cubeCobra.fetchCubeCards(cubeID))?.cards

  if (cards == null) {
    throw new Error('Failed ot fetch cards')
  }

  const sortedCards = sortBy(cards, [
    (card) => {
      return card.name
    }
  ])

  const cardGroups = groupBy(sortedCards, (card) => {
    const cardOrFrontFace = card.card_faces != null ? card.card_faces[0] : card
    if (/\bLand\b/.test(cardOrFrontFace.type_line)) {
      return 'l'
    }
    if (cardOrFrontFace.colors?.length === 0) {
      return 'c'
    }
    if (cardOrFrontFace.colors?.length === 1) {
      return cardOrFrontFace.colors[0].toLowerCase()
    }
    return 'm'
  })

  const groups: Record<string, string> = {
    w: 'White',
    u: 'Blue',
    b: 'Black',
    r: 'Red',
    g: 'Green',
    m: 'Multicolor',
    c: 'Colorless',
    l: 'Land'
  }

  const output = compact(
    Object.keys(groups).map((g) => {
      if (cardGroups[g] == null) {
        return null
      }
      return {
        label: groups[g],
        cards: cardGroups[g]
      }
    })
  )
    .reduce((result, group) => {
      result.push(
        group.label,
        ...group.cards.map((card) => `- [ ] ${card.name}`),
        ''
      )

      return result
    }, [] as string[])
    .join('\n')

  log('\n\n')
  log(output, Color.magenta)
  log('\n\n')
}

main()
