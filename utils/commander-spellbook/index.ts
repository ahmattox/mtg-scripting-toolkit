/**
 * The Commander Spellbook is a catalog of card combos. Each combo includes a
 * set of cards and other information about the combo. The prerequisites, steps,
 * and results are all human readable, but the results have been split up into
 * sentences to make it possible to do some filtering.
 *
 * https://commanderspellbook.com
 *
 * Scryfall Card objects are fetched for each card in the combo and combined
 * format legality is evaluated.
 *
 * The results of the fetched and compiled combos are cached.
 */

export { fetchCommanderSpellbook } from './fetch'

export { combosWithCard, uniqueOutcomes, legalInFormat } from './filter'
