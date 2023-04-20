import * as scryfall from 'utils/scryfall'

const includedSetTypes = ['core', 'expansion', 'masters', 'draft_innovation']
const excludedSets = [
  'sum',
  'lea',
  '2ed',
  'plist',
  'ren',
  'rin',
  'chr',
  '4bb',
  'fbb',
  'me1',
  'me2',
  'me3',
  'me4',
  'tpr',
  'mp',
  'j21',
  'jmp'
]
const includeFunnySets = ['unf', 'ust', 'unh', 'ugl']

/***
 * Filter Scryfall sets down to the 'main' sets including masters, funny, and
 * other sets designed to be drafted.
 */
export function filterMainSets(
  sets: scryfall.Set[],
  includeUnreleased = false
) {
  const now = new Date()

  return sets.filter(
    (set) =>
      (includedSetTypes.includes(set.set_type) ||
        includeFunnySets.includes(set.code)) &&
      set.parent_set_code == null &&
      !excludedSets.includes(set.code) &&
      (includeUnreleased || new Date(set.released_at) < now)
  )
}
