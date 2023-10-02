import fs from 'node:fs'
import path from 'node:path'
import { sortBy } from 'lodash'
import * as d3 from 'd3'

import { squareExtent } from './squareExtent'
import { hslToHexString } from './hslToHexString'
import { featuredCubeIDs } from './featuredCubeIDs'
import { rotatePoint } from './rotatePoint'

/**
 * Generate and SVG of the Cube Map for the Cube Con 2023 print. Capturing the
 * canvas element of the interactive map itself didn't have the best quality for
 * printing.
 *
 * This generates an SVG matching the style of the interactive map, scaled,
 * rotated, and sized for the print.
 *
 *   $ yarn run tsx ./scripts/examples/cube-map/index.ts /output.svg
 */
async function main() {
  const outputPath = process.argv[2]

  const csv = fs.readFileSync(path.join(__dirname, './cube-map.csv')).toString()

  const unsortedCubes = d3
    .csvParse<
      | 'cube_id'
      | 'x'
      | 'y'
      | 'size'
      | 'owner'
      | 'name'
      | 'image'
      | 'num_followers'
      | 'cluster'
    >(csv)
    .map((cube) => {
      const [x, y] = rotatePoint(
        0,
        0,
        cube.x ? parseFloat(cube.x) : 0,
        cube.y ? parseFloat(cube.y) : 0,
        73.8
      )

      return {
        ...cube,
        x,
        y,
        cluster: cube.cluster ? parseInt(cube.cluster) : 0,
        size: cube.num_followers
          ? Math.pow(parseInt(cube.num_followers) + 1, 0.24) * 2
          : 0
      }
    })

  const cubes = sortBy(unsortedCubes, (cube) =>
    featuredCubeIDs.includes(cube.cube_id!) ? 1 : 0
  )

  const width = 11505
  const height = 11505

  const scale = width / 1000

  const extent = squareExtent(cubes)

  const scaleX = d3.scaleLinear([0, width]).domain(extent[0])
  const scaleY = d3.scaleLinear([0, height]).domain(extent[1])

  const colorCount = 32

  const clusterColors = Array.from(Array(colorCount)).map((_, index) => {
    return hslToHexString((index / colorCount) * 120 + 100, 50, 50)
  })

  console.log('cubes: ', cubes.length)

  const svgLines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" x="0" y="0">`,
    `<style type="text/css">`,
    `.p{fill:#0FAA3B;stroke:#FFFFFF;stroke-width:${0.13 * scale};}`,
    ...clusterColors.map((color, index) => `.c${index}{fill:${color};}`),
    `</style>`,
    ...cubes.map(
      (cube) =>
        `<circle class="p c${cube.cluster % colorCount}" r="${
          (cube.size / 2 + 0.18) * scale
        }" cx="${scaleX(cube.x)}" cy="${scaleY(cube.y)}" />`
    ),
    `</svg>`
  ]

  fs.writeFileSync(outputPath, svgLines.join('\n'))
}

main()
