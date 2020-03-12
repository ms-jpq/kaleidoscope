import { Polygon, Restriction } from "./game-constants"
import "../wasm.exec"
import "../wasm_go.js"

declare const Go: any

export type Result<T> =
  | {
      type: "error"
      error: string
    }
  | {
      type: "result"
      value: T
    }

export type GoFunction<T extends any[] = [], U = undefined> = (
  ..._: T
) => Result<U>

export const Instantiate = async (uri: string) => {
  const go = new Go()
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(uri),
    go.importObject,
  )
  const binding: Record<string, GoFunction<any, any>> = (globalThis[
    "__go-wasm__"
  ] = {})

  const retrieve = <T extends any[] = [], U = undefined>(
    name: string,
  ): GoFunction<T, U> => {
    const func =
      binding[name] ||
      (() => ({ type: "error", error: `${name} is not a function` }))
    return (...args: T) => func(...args)
  }

  const run = (): Promise<void> => go.run(instance)

  return { run, retrieve }
}

export type Release = () => void

export type ReleasableArray = {
  array: Float32Array
  release: Release
}

export type DrawingOptions = {
  rotations: number
  theta: number
  dotTracerSize: number
  vertexTracerSize: number
}

export type DrawingInstructions = {
  polygon: ReleasableArray
  dots: ReleasableArray
  vertextracers: ReleasableArray
  dottracers: ReleasableArray
  centroid: { x: number; y: number }
  count: number
}

export const ReleaseDrawingInstructions = (
  instructions: DrawingInstructions,
) => {
  const {
    polygon: { release: r1 },
    dots: { release: r2 },
    vertextracers: { release: r3 },
    dottracers: { release: r4 },
  } = instructions
  r1()
  r2()
  r3()
  r4()
}

export type GoExports = {
  NewVertices: GoFunction<[Polygon]>
  NewRestriction: GoFunction<[Restriction]>
  NewCompression: GoFunction<[number]>
  NewDots: GoFunction<[number]>
  NewVertex: GoFunction<[[number, number], boolean]>
  RequestDrawingInstructions: GoFunction<[DrawingOptions], DrawingInstructions>
}
