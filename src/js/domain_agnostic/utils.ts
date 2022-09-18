import { timer } from "nda/iso/prelude.js"

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

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export const shuffle = <T>(pool: Iterable<T>) => {
  const coll = [...pool]
  for (let i = coll.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[coll[i], coll[j]] = [coll[j]!, coll[i]!]
  }
  return coll
}
