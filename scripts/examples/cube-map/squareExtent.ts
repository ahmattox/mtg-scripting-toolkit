import * as d3 from 'd3'

/**
 * Evaluate the smallest square bounding box around a set of points.
 */
export function squareExtent(data: { x: number; y: number }[]) {
  let xRange = [d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)] as [
    number,
    number
  ]
  let yRange = [d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)] as [
    number,
    number
  ]

  const dx = xRange[1] - xRange[0]
  const dy = yRange[1] - yRange[0]

  if (dx > dy) {
    yRange = [yRange[0] - (dx - dy) / 2, yRange[1] + (dx - dy) / 2]
  } else {
    xRange = [xRange[0] - (dy - dx) / 2, xRange[1] + (dy - dx) / 2]
  }

  return [xRange, yRange] as [[number, number], [number, number]]
}
