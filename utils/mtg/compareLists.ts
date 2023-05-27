import { difference, intersection } from 'lodash'

/**
 * Compares two lists of card names returning a list of values shared between
 * the two lists and lists unique to each.
 *
 * Names are checked for exact matches, including spelling and punctuation, so
 * it may be useful to validate card names with the spell check function first.
 *
 * Technically this works on any sets of strings, but that's not what we're
 * here for.
 */
export function compareLists(listA: string[], listB: string[]) {
  return {
    shared: intersection(listA, listB),
    uniqueToA: difference(listA, listB),
    uniqueToB: difference(listB, listA)
  }
}
