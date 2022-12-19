import path from 'node:path'
import fs from 'node:fs'

const cacheDirectory = path.resolve(__dirname, '../.cache')

/**
 * Returns a cached value, or executes the callback to retrieve and cache a new
 * value.
 *
 * This is a simple separate cache from the Gatsby cache intended for long lived
 * values. In particular, the Gatsby cache gets cleared somewhat frequently and
 * card illustration details for page backgrounds take a lot of time and
 * requests to fetch.
 *
 * Add SKIP_CACHE=1 to reload cached values.
 */

export async function cachedValue<T>(
  key: string,
  getValue: () => Promise<T>
): Promise<T> {
  const filePath = path.join(cacheDirectory, `${key}.json`)

  if (!fs.existsSync(cacheDirectory)) {
    await fs.promises.mkdir(cacheDirectory)
  }

  if (process.env.SKIP_CACHE != null && fs.existsSync(filePath)) {
    const stringValue = await (await fs.promises.readFile(filePath)).toString()
    return JSON.parse(stringValue)
  }

  const newValue = await getValue()

  if (newValue != null) {
    await fs.promises.writeFile(filePath, JSON.stringify(newValue))
  }

  return newValue
}
