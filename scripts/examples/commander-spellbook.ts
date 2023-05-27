import * as spellbook from 'utils/commander-spellbook'

import { log } from 'utils/log'

/**
 * Filters the list of combos from the Commander Spellbook for combos that
 * include a specific result. Combos could also be filtered by cards they
 * contain or format legality.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/commander-spellbook
 *
 */
async function main() {
  const combos = await spellbook.fetchCommanderSpellbook()

  const infiniteCombatCombos = combos.filter((combo) =>
    combo.results?.includes('Infinite combat phases')
  )

  log('\n')
  log(
    infiniteCombatCombos.map((combo) => combo.cardNames.join(', ')).join('\n')
  )
  log('\n')
}

main()
