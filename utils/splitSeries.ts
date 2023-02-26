/**
 * Split an array of objects into an array of separate series object for each
 * given key.
 *
 * The series can either be a simple array of keys to split on, or an object
 * keyed on series keys with additional attributes.
 */
export function splitSeries<T extends Record<string, number | string>>(
  values: T[],
  series: (keyof T)[] | Record<keyof T, { name: string; color?: string }>,
  independentValue: (value: T) => number
): {
  name: string
  color?: string
  values: [number, number | string][]
}[] {
  const seriesKeys = Array.isArray(series) ? series : Object.keys(series)

  const initial = seriesKeys.map((seriesKey) => {
    const attributes = !Array.isArray(series)
      ? series[seriesKey]
      : { name: seriesKey as string }

    return {
      ...attributes,
      values: [] as [number, number | string][]
    }
  })

  return values.reduce((result, value) => {
    for (const [index, seriesKey] of seriesKeys.entries()) {
      result[index].values.push([independentValue(value), value[seriesKey]])
    }
    return result
  }, initial)
}
