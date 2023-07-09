import * as scryfall from 'utils/scryfall'

import { Color, log } from 'utils/log'

/**
 * Log some attributes of every set that can be pasted into a CSV.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/set-details-csv.ts
 *
 */

async function main() {
  const sets = await scryfall.fetchSets()

  const output = sets
    .map((set) => {
      return `${set.code},"${set.name}"`
    })
    .join('\n')

  log('\n\n')
  log(output, Color.green)
  log('\n\n')
}

main()
