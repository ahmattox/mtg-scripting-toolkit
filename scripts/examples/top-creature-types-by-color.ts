import { intersection, sortBy, uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'
import * as mtg from 'utils/mtg'

import { Color, log } from 'utils/log'
import { cachedValue } from 'utils/cache'
import { regexEscape } from 'utils/regexEscape'

/**
 * Count the top creature types for each color across all MTG cards.
 *
 * Note this is partially implemented to also count references to creature types
 * which is more important for tribal interactions. This is incomplete and
 * doesn't count for type name inflections.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/top-creature-types-by-color
 *
 */
async function main() {
  const cards = await cachedValue('creature-type-analysis-cards', async () => {
    return mtg.uniqueFirstPrintings(
      await scryfall.fetchBulkData('default_cards')
    )
  })

  const allCreatureTypes = await cachedValue(
    'creature-type-analysis-types',
    async () => {
      return await scryfall.fetchCreatureTypes()
    }
  )

  const creatureTypesPattern = new RegExp(
    `\\b(${allCreatureTypes.join('|')})\\b`,
    'gi'
  )

  // Add type information to each card including it's creature types and types
  // referenced in its rules text.
  const cardsWithAttributes = cards.map((card) => {
    const types = mtg.card.types(card)
    const creatureTypes = intersection(types.subTypes, allCreatureTypes)

    // Removes references to a card's own name from their text since they often
    // contain a creature type, e.g. "Goblin King".
    const fullText = mtg.card
      .text(card)
      .replace(new RegExp(`\\b${regexEscape(card.name)}\\b`, 'g'), '~')

    // TODO: this fails to find plural type references
    const creatureTypeReferences: string[] = []
    const creatureTypeMatches = fullText.matchAll(creatureTypesPattern)

    for (const match of creatureTypeMatches) {
      creatureTypeReferences.push(match[0])
    }

    return {
      card,
      types,
      creatureTypes,
      fullText,
      creatureTypeReferences: uniq(creatureTypeReferences)
    }
  })

  const typeCountsPerColor = cardsWithAttributes.reduce(
    (result, row) => {
      const colors =
        row.card.color_identity.length === 0 ? ['C'] : row.card.color_identity

      for (const color of colors) {
        for (const type of row.creatureTypes) {
          if (result[color][type] == null) {
            result[color][type] = 0
          }
          result[color][type]++
        }
      }
      return result
    },
    {
      W: {},
      U: {},
      B: {},
      R: {},
      G: {},
      C: {}
    } as Record<string, Record<string, number>>
  )

  const result = Object.entries(typeCountsPerColor).map(([color, types]) => {
    return {
      color,
      types: sortBy(
        Object.entries(types).map(([type, count]) => ({ name: type, count })),
        (t) => t.count
      ).reverse()
    }
  })

  const output = result
    .map((color) => {
      const types = color.types
        .slice(0, 100)
        .map((t) => `${t.name}, ${t.count}`)
        .join('\n')
      return `${color.color}\n\n${types}`
    })
    .join('\n\n\n')

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
