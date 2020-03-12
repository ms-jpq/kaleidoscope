export const $ = <T extends Element = HTMLElement>(
  selector: string,
  e: ParentNode = document,
) => e.querySelector(selector) as T

export const $$ = <T extends Element = HTMLElement>(
  selector: string,
  e: ParentNode = document,
) => [...e.querySelectorAll(selector)] as T[]

export const DOMReady = () =>
  new Promise<void>((resolve) =>
    document.addEventListener("DOMContentLoaded", resolve as any, {
      once: true,
    }),
  )

export const Wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const Classes = (...classes: (string | Record<string, boolean>)[]) =>
  classes
    .flatMap((c) => {
      if (typeof c === "string") {
        return [c]
      } else {
        return Object.entries(c).flatMap(([k, v]) => (v ? [k] : []))
      }
    })
    .join(" ")

export const Between = (min: number, max: number) => (value: number) =>
  Math.max(min, Math.min(max, value))

export const Debounce = <F extends (...args: any[]) => any>(
  ms: number,
  f: F,
) => {
  let timer = Infinity
  return async (...args: Parameters<F>) => {
    clearTimeout(timer)
    timer = setTimeout(() => f(...args), ms) as any
  }
}

export const Throttle = <F extends (...args: any[]) => any>(
  ms: number,
  f: F,
) => {
  let timer = Infinity
  let throttling = false
  const throttled = (...args: Parameters<F>) => {
    if (throttling) {
      return
    }
    throttling = true
    f(...args)
  }
  return (...args: Parameters<F>) => {
    clearTimeout(timer)
    if (throttling) {
      timer = setTimeout(() => throttled(...args), ms) as any
    } else {
      setTimeout(() => (throttling = false), ms)
      throttled(...args)
    }
  }
}

export const NewRequest = <T>() => {
  let resolve: (value: T) => void = () => undefined
  const promise = new Promise<T>((res) => (resolve = (value) => res(value)))
  return { resolve, promise }
}

export const Random = (lo: number, hi: number) =>
  Math.floor(Math.random() * (hi - lo + 1)) + lo

export const Range = (lo: number, hi: number) =>
  [...Array(hi - lo + 1)].map((_, i) => i + lo)

export const Randomize = <T>(list: T[]) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export const Timer = () => {
  let prev = performance.now()
  return () => {
    const temp = prev
    const next = (prev = performance.now())
    return next - temp
  }
}

export const Animate = (draw: (_: number) => void | Promise<void>) => {
  const timer = Timer()
  let cont = true
  const runLoop = async () => {
    await draw(1000 / timer())
    cont && requestAnimationFrame(runLoop)
  }
  requestAnimationFrame(runLoop)
  return () => (cont = false)
}

export const Download = ({ name, uri }: { name: string; uri: string }) => {
  const a = document.body.appendChild(document.createElement("a"))
  a.target = "_blank"
  a.download = name
  a.href = uri
  a.click()
  a.remove()
}
