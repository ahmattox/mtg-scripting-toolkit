export function average(array: number[]): number {
  return array.reduce((a, b) => a + b) / array.length
}

export function median(array: number[]): number | undefined {
  if (array.length === 0) {
    return undefined
  }

  const sorted = Array.from(array).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

export function standardDeviation(array: number[]): number {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  )
}
