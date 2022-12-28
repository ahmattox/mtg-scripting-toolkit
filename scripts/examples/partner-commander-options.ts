import prompt from 'prompt'

import * as scryfall from '../../utils/scryfall'
import * as mtg from '../../utils/mtg'

import { Color, log } from '../../utils/log'

const partnerWithPattern = /Partner with (?<partnerName>.*?)( \(|\n|$)/

function normalizeColorIdentity(
  ...colorIdentities: string[][]
): scryfall.Color[] {
  const allColors = ['W', 'U', 'B', 'R', 'G'] as scryfall.Color[]
  const input = colorIdentities
    .flatMap((c) => c)
    .join()
    .toUpperCase()
  return allColors.filter((c) => input.includes(c))
}

function colorIdentitiesEqual(
  colorsA: scryfall.Color[],
  colorB: scryfall.Color[]
) {
  return colorsA.join('') === colorB.join('')
}

/**
 * Find all commander partner combinations, including 'partner with' and
 * background pairings that exactly fit a given color identity.
 *
 * Run with
 *
 *     yarn run tsx ./scripts/examples/partner-commander-options
 *
 */
async function main() {
  prompt.message = ''
  prompt.start()

  const { colorIdentityInput } = await prompt.get([
    { name: 'colorIdentityInput', message: 'Color identity (wubrg)' }
  ])

  if (typeof colorIdentityInput !== 'string') {
    throw new Error('Invalid color identity')
  }

  const targetColorIdentity = normalizeColorIdentity(
    colorIdentityInput.split('')
  )

  const cards = await scryfall.fetchBulkData()

  const validPartnerPairs: [scryfall.Card, scryfall.Card][] = []

  const matchesColorIdentity = (cardA: scryfall.Card, cardB: scryfall.Card) => {
    return colorIdentitiesEqual(
      normalizeColorIdentity(cardA.color_identity, cardB.color_identity),
      targetColorIdentity
    )
  }

  // Partner Cards

  const partnerCards = cards.filter(
    (card) =>
      card.keywords.includes('Partner') &&
      !card.keywords.includes('Partner with')
  )

  let cardAIndex = 1
  for (const cardA of partnerCards) {
    for (const cardB of partnerCards.slice(cardAIndex)) {
      if (matchesColorIdentity(cardA, cardB)) {
        validPartnerPairs.push([cardA, cardB])
      }
    }
    cardAIndex++
  }

  // Partner With Cards

  const partnerWithCards = cards.filter((card) =>
    card.keywords.includes('Partner with')
  )
  cardAIndex = 1
  for (const cardA of partnerWithCards) {
    const partnerName = mtg.card.text(cardA).match(partnerWithPattern)
      ?.groups?.partnerName
    for (const cardB of partnerWithCards.slice(cardAIndex)) {
      if (partnerName === cardB.name && matchesColorIdentity(cardA, cardB)) {
        validPartnerPairs.push([cardA, cardB])
      }
    }
    cardAIndex++
  }

  // Background Cards

  const backgroundCommanders = cards.filter((card) =>
    mtg.card.textIncludes(card, 'Choose a Background')
  )

  const backgrounds = cards.filter((card) =>
    card.type_line.includes('— Background')
  )

  for (const cardA of backgroundCommanders) {
    for (const cardB of backgrounds) {
      if (matchesColorIdentity(cardA, cardB)) {
        validPartnerPairs.push([cardA, cardB])
      }
    }
  }

  log()
  log(`Found ${validPartnerPairs.length} partner pairs`, Color.blue)
  log()

  log(
    validPartnerPairs
      .map(([cardA, cardB]) => `${cardA.name} - ${cardB.name}`)
      .join('\n'),
    Color.blue
  )
  log()
}

main()
