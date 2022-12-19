import * as config from './config'
import { CardFaceName } from './types'

/**
 * Returns the URL for for an image with a give card name.
 */
export function imageURL(
  options: {
    cardName?: string
    set?: string
    id?: string
    version?: 'normal' | 'art_crop'
  },
  face?: CardFaceName
): string {
  const { version = 'normal' } = options

  if (options.id) {
    const params = {
      format: 'image',
      version
    } as {
      [key: string]: string
    }

    if (face) {
      params.face = face
    }

    return `${config.apiURL}/cards/${options.id}?${new URLSearchParams(
      params
    ).toString()}`
  }

  const params = {
    exact: options.cardName,
    format: 'image',
    version
  } as {
    [key: string]: string
  }

  if (options.set) {
    params.set = options.set
  }

  if (face) {
    params.face = face
  }

  return `${config.apiURL}/cards/named?${new URLSearchParams(
    params
  ).toString()}`
}

/**
 * Returns the urls for the front and back faces of a double faced card
 * formatted: `Front // Back`
 */
export function imageURLs(attributes: {
  cardName?: string
  set?: string
  id?: string
}): { front: string; back?: string } {
  const faces = {
    front: imageURL(attributes)
  } as {
    front: string
    back?: string
  }

  if (attributes.cardName?.match(/\/\//)) {
    faces.back = imageURL(attributes, CardFaceName.Back)
  }

  return faces
}
