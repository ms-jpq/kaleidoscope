import { timer } from "nda/dist/isomorphic/prelude"

export const Between = (min: number, max: number) => (value: number) =>
  Math.max(min, Math.min(max, value))

export const Animate = (draw: (_: number) => void | Promise<void>) => {
  const t = timer()
  let cont = true
  const runLoop = async () => {
    await draw(1000 / t())
    cont && requestAnimationFrame(runLoop)
  }
  requestAnimationFrame(runLoop)
  return () => (cont = false)
}
