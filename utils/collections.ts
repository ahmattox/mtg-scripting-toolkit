import { uniq } from 'lodash'

export const toObjectKeyedOn = <T>(array: T[], key: string) => {
  return array.reduce(
    (object, element) => ({
      ...object,
      [element[key]]: element
    }),
    {}
  )
}

export const eachAsync = async <T>(
  array: T[],
  callback: (element: T, index: number) => void
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index)
  }
}

export function toggle<T>(array: T[], element: T, include: boolean): T[] {
  if (include) {
    return uniq([...array, element])
  } else {
    return array.filter((item) => item !== element)
  }
}

/**
 * Returns all possible permutations of a set, e.g. every ordering of all items
 * in the set.
 */
export function permutations<T>(value: T[]): T[][] {
  const result: T[][] = []

  const permute = (array: T[], m: T[] = []) => {
    if (array.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < array.length; i++) {
        const current = array.slice()
        const next = current.splice(i, 1)
        permute(current.slice(), m.concat(next))
      }
    }
  }

  permute(value)

  return result
}
