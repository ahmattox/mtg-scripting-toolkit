import * as d3 from 'd3'

type URLOptions = {
  id: string
  sheetName?: string
  gid?: string
}

function csvURL(options: URLOptions) {
  const { id, sheetName, gid } = options

  if (gid != null) {
    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&id=${id}&gid=${gid}`
  }
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheetName}`
}

/**
 * Fetch the contents of a Google sheet. Specify the id and either the 'sheet
 * name' or 'gid' which you can find in the sheet's URL.
 */
export async function fetchSheet<T extends string>(urlOptions: URLOptions) {
  const data = await (await fetch(csvURL(urlOptions))).text()

  return d3.csvParse<T>(data)
}
