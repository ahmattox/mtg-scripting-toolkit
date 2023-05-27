import { Color, log } from 'utils/log'

import * as cubeCobra from 'utils/cube-cobra'
import * as mtg from 'utils/mtg'

/**
 * Compare two Cube lists on Cube Cobra. Prints the list of cards included in
 * both Cube, and then unique to each.
 *
 * Pass two urls to cubes.
 *
 *
 * Run with
 *
 *     yarn tsx ./scripts/examples/compare-cube-cobra-lists [cube-link] [cube-link]
 *
 */

async function main() {
  const cubeLinkA = process.argv[2]
  const cubeLinkB = process.argv[3]

  if (cubeLinkA == null || cubeLinkB == null) {
    throw new Error('Pass two paths to lists of cards to compare.')
  }

  const cubeIDA = cubeCobra.cubeIDFromLink(cubeLinkA)
  const cubeIDB = cubeCobra.cubeIDFromLink(cubeLinkB)

  if (typeof cubeIDA !== 'string') {
    throw new Error('Invalid link for first cube')
  }

  if (typeof cubeIDB !== 'string') {
    throw new Error('Invalid link for second cube')
  }

  const cardsA = await cubeCobra.fetchCubeList(cubeIDA)
  const cardsB = await cubeCobra.fetchCubeList(cubeIDB)

  const comparison = mtg.compareLists(cardsA, cardsB)

  log()
  log(`${comparison.shared.length} cards in both Cubes`, Color.blue)
  log(`${comparison.uniqueToA.length} cards in only cube A`, Color.green)
  log(`${comparison.uniqueToB.length} cards in only cube B`, Color.magenta)
  log()

  log()
  log()
  log(`In Both Cubes:`)
  log()
  log(comparison.shared.join('\n'), Color.blue)

  log()
  log()
  log(`In Only Cube A:`)
  log()
  log(comparison.uniqueToA.join('\n'), Color.green)

  log()
  log()
  log(`In Only Cube B:`)
  log()
  log(comparison.uniqueToB.join('\n'), Color.magenta)

  log()
}

main()
