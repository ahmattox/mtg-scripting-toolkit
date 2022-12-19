import { compact } from 'lodash'

import { FetchCardID } from './types'
import { fetchCard } from './fetchCard'

export async function fetchCardArt(attributes: FetchCardID): Promise<{
  id: string
  name: string
  set: string
  artist: string
  imageURL: string
} | null> {
  if (attributes.id == null && attributes.name == null) {
    throw new Error('Can not fetch card art without a name or id')
  }

  const card = await fetchCard(attributes)

  if (card == null || card.object === 'error') {
    throw new Error(
      `No card card found for  ${compact([
        attributes.name,
        attributes.set,
        attributes.id
      ]).join(' - ')}. ${card?.code}, ${card?.details}`
    )
  }

  if (card == null) {
    return null
  }

  if (card?.card_faces != null) {
    const { name } = attributes

    if (name == null) {
      throw new Error(
        `Card name must be specified for double faced cards: ${attributes.id}`
      )
    }

    const face = card.card_faces.find(
      (face) => face.name.toLowerCase() === name.toLowerCase()
    )

    if (face == null) {
      throw new Error(`No face named ${attributes.name} on fetched card`)
    }

    return {
      id: card.id,
      name: face.name,
      set: card.set,
      artist: face.artist,
      imageURL: face.image_uris.art_crop
    }
  }

  return {
    id: card.id,
    name: card.name,
    set: card.set,
    artist: card.artist,
    imageURL: card.image_uris.art_crop
  }
}
