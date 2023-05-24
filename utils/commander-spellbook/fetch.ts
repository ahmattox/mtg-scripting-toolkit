import { compact } from 'lodash'

import * as scryfall from 'utils/scryfall'

import { fetchSheet } from 'utils/googleSheets'
import { collectiveLegality } from 'utils/mtg'

import { googleSheetID, combosSheetName } from './config'
import { Combo } from './types'
import { cachedValue } from 'utils/cache'

function slug(name: string) {
  return name.toLowerCase().replace(/[- ,'’]/g, '')
}

/**
 * Fetches the library of combos in the Commander Spellbook.
 *
 * Results are cached.
 */
export async function fetchCommanderSpellbook(): Promise<Combo[]> {
  return cachedValue(`commander-spellbook`, async () => {
    const comboRows = await fetchSheet({
      id: googleSheetID,
      sheetName: combosSheetName
    })

    const allCards = await scryfall.fetchBulkData('oracle_cards')

    const cardsByName = allCards.reduce((result, card) => {
      result[slug(card.name)] = card
      if (card.card_faces != null) {
        result[slug(card.card_faces[0].name)] = card
      }
      return result
    }, {} as Record<string, scryfall.Card>)

    const combos = comboRows.map((row) => {
      const cardNames = compact(
        [
          row['Card 1'],
          row['Card 2'],
          row['Card 3'],
          row['Card 4'],
          row['Card 5'],
          row['Card 6'],
          row['Card 7'],
          row['Card 8'],
          row['Card 9'],
          row['Card 10']
        ].map((name) => name?.trim())
      )

      if (cardNames.length == 0) {
        return null
      }

      const cards = cardNames.map((name) => {
        const card = cardsByName[slug(name)]
        if (card == null) {
          console.log(`No card found with name: "${name}"`)
        }
        return card
      })

      return {
        cardNames,
        cards,
        legalities: collectiveLegality(cards) as Record<
          scryfall.Format,
          'legal' | 'not_legal'
        >,
        colorIdentity: row['Color Identity'],
        prerequisites: row['Prerequisites'],
        steps: row['Steps'],
        results: row['Results']
          ?.split(/\.( |$)/)
          .map((value) => value.trim())
          .filter((value) => value.length > 0),
        variantIDs: row['Variant IDs']
      }
    })

    return compact(combos)
  })
}
