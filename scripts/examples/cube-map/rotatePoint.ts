export function rotatePoint(
  cx: number,
  cy: number,
  x: number,
  y: number,
  angle: number
) {
  const radians = (Math.PI / 180) * angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  return [
    cos * (x - cx) + sin * (y - cy) + cx,
    cos * (y - cy) - sin * (x - cx) + cy
  ]
}
