import Fuse from 'fuse.js'
import { uniq } from 'lodash'

import * as scryfall from 'utils/scryfall'

/**
 * Spellcheck a list of MTG card names. This checks against the Scryfall
 * database for exact card names matches, including spelling and punctuation,
 * and returns a set of results, including suggestions for invalid names.
 *
 * Double faced cards must have both parts of the name separated by " // ".
 * Adventure cards must have only the top card name.
 */
export async function spellCheckCardNames(
  namesToValidate: string[],
  options: { skipValidation?: (value: string) => boolean } = {}
) {
  const { skipValidation = () => false } = options

  const cardNames = await fetchCardNames()

  const fuzzy = new Fuse(cardNames, { includeScore: true })

  return namesToValidate.map((name) => {
    if (skipValidation(name)) {
      return { name, valid: true, skipped: true }
    }

    const valid = cardNames.includes(name)

    if (valid) {
      return { name, valid: true }
    }

    const suggestion = fuzzy.search(name ?? '')[0]?.item

    return {
      name,
      valid: false,
      suggestion
    }
  })
}

async function fetchCardNames() {
  const cards = await scryfall.fetchBulkData('oracle_cards')

  return uniq(
    cards.map((card) => {
      if (card.layout === 'transform' || card.layout === 'modal_dfc') {
        return `${card.card_faces![0].name} // ${card.card_faces![1].name}`
      }
      if (card.layout === 'adventure') {
        return card.card_faces![0].name
      }
      return card.name
    })
  )
}
