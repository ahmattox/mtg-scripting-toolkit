import { partition, uniq } from 'lodash'

export const allSuperTypes = [
  'Basic',
  'Legendary',
  'Ongoing',
  'Snow',
  'World',
  'Elite',
  'Host'
]

export const allTypes = [
  'Creature',
  'Planeswalker',
  'Artifact',
  'Enchantment',
  'Instant',
  'Sorcery',
  'Land'
]

export const allNonstandardTypes = [
  'Stickers',
  'Vanguard',
  'Plane',
  'Scheme',
  'Phenomenon',
  'Hero',
  'Conspiracy',
  'Dungeon'
]

interface Types {
  superTypes: string[]
  types: string[]
  subTypes: string[]
}

/**
 * Returns an object describing the types of a card including its super types,
 * and subtypes.
 */
export function types<T extends { type_line: string }>(card: T): Types {
  const faceTypeStrings = card.type_line.split('//').map((v) => v.trim())

  return faceTypeStrings
    .map((faceType) => {
      const [typesString, subTypesString] = faceType
        .split('—')
        .map((value) => value.trim())
      const [superTypes, types] = partition(typesString.split(' '), (type) =>
        allSuperTypes.includes(type)
      )
      const subTypes = subTypesString?.split(' ')

      return {
        superTypes: superTypes ?? [],
        types: types ?? [],
        subTypes: subTypes ?? []
      }
    })
    .reduce((result, face) => {
      return {
        superTypes: uniq([...result.superTypes, ...face.superTypes]),
        types: uniq([...result.types, ...face.types]),
        subTypes: uniq([...result.subTypes, ...face.subTypes])
      }
    })
}
