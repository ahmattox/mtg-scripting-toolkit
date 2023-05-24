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

export async function fetchSheet(urlOptions: URLOptions) {
  const data = await (await fetch(csvURL(urlOptions))).text()

  return d3.csvParse<
    | ''
    | 'Card 1'
    | 'Card 2'
    | 'Card 3'
    | 'Card 4'
    | 'Card 5'
    | 'Card 6'
    | 'Card 7'
    | 'Card 8'
    | 'Card 9'
    | 'Card 10'
    | 'Color Identity'
    | 'Prerequisites'
    | 'Steps'
    | 'Results'
    | 'Variant IDs'
    | 'Duplicate Protection'
  >(data)
}
