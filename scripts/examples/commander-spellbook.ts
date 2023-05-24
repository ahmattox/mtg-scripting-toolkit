import * as spellbook from 'utils/commander-spellbook'

import { log } from 'utils/log'

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
