import { deckLinkPattern } from './config'
import { Deck } from './types'

/**
 * Extract the ID from a Moxfield URL.
 */
export function deckIDFromLink(url: string) {
  return url.match(deckLinkPattern)?.groups?.deckID ?? null
}

/**
 * The API URL for a deck on Moxfield with a given ID.
 */
export function apiURLForDeck(id: string) {
  return `https://api2.moxfield.com/v3/decks/all/${id}`
}

/**
 * Fetches a deck from Moxfield and returns it as is from the API. The deck
 * includes the card list and some metadata about the deck.
 */
export async function getDeck(url: string) {
  const id = deckIDFromLink(url)

  if (id == null) {
    return null
  }

  const response = (await (await fetch(apiURLForDeck(id))).json()) as Deck

  return response
}

/**
 * Extracts the list of card names from a deck object from Moxfield's API.
 */
export function cardNamesFromDeck(deck: Deck) {
  return Object.values(deck.boards.mainboard.cards).map(
    (item) => item.card.name
  )
}
