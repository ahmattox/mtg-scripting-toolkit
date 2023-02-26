/**
 * Fetches the full Comprehensive Magic Rules as they were at the time of a
 * given set from Academy Ruins.
 *
 * https://academyruins.com
 */
export async function fetchComprehensiveRules(
  setCode: string
): Promise<string | null> {
  const url = `https://api.academyruins.com/file/cr/${setCode}?format=txt`

  const response = await fetch(url)

  if (!response.ok) {
    return null
  }

  return response.text()
}
