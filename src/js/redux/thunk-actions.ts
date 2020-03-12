import { Action, State } from "./state"
import { Animate } from "../domain_agnostic/utils"
import { choice } from "nda/dist/isomorphic/rand"
import { Dispatch, Fetch, ThunkAction } from "../domain_agnostic/simple-redux"
import { download } from "nda/dist/browser/dom"
import { DrawingOptions, GoExports } from "../interlope"
import { Gears, Polygon, Preset, Restriction, Speed } from "../game-constants"
import { NewRecorder } from "../domain_agnostic/recorder"
import { NewRenderer } from "../canvas/canvas"
import { sleep, timer } from "nda/dist/isomorphic/prelude"

type A = Action | ThunkAction<State, Action>
type TA = ThunkAction<State, Action | A>

const STATISTICS_THROTTLE = 1000

const DRAWING_OPTIONS: DrawingOptions = {
  theta: Math.PI / 12,
  rotations: 20,
  dotTracerSize: 0.005,
  vertexTracerSize: 0.05,
}

const newStatistics = ((ms) => {
  let timer = Infinity
  let throttling = false
  let fpsRecord: number[] = []
  let dotsDrawn = 0
  const signal = (dispatch: Dispatch<Action>) => {
    const avg =
      fpsRecord.reduce((acc, curr) => acc + curr, 0) / fpsRecord.length
    dispatch({ type: "statistics-update", fps: avg, dotsDrawn })
    fpsRecord = []
    dotsDrawn = 0
  }
  return (fps: number, newDots: number): TA => (fetch, dispatch) => {
    fpsRecord = [...fpsRecord, fps]
    dotsDrawn += newDots
    clearTimeout(timer)
    if (throttling) {
      timer = setTimeout(() => signal(dispatch), ms) as any
    } else {
      throttling = true
      setTimeout(() => (throttling = false), ms)
      signal(dispatch)
    }
  }
})(STATISTICS_THROTTLE)

const redrawCanvas = (fetch: Fetch<State>) => {
  const {
    page: { canvas, wasm },
    canvas: { colours },
  } = fetch()
  if (wasm.status !== "loaded" || canvas.status !== "loaded") {
    return
  }
  const {
    exports: { RequestDrawingInstructions },
  } = wasm
  const { initialize } = canvas.render
  RequestDrawingInstructions(DRAWING_OPTIONS)
  const res = RequestDrawingInstructions(DRAWING_OPTIONS)
  if (res.type === "error") {
    return console.error(res.error)
  }
  initialize(res.value, colours)
}

const redrawLastFrame = (fetch: Fetch<State>) => {
  const {
    page: { canvas },
    canvas: { drawTracers },
  } = fetch()
  if (canvas.status !== "loaded") {
    return
  }
  const { redraw } = canvas.render
  redraw(drawTracers === "on")
}

const run = (fetch: Fetch<State>, dispatch: Dispatch<Action | any>) =>
  Animate(async (fps) => {
    const t = timer()
    const {
      game: {
        speed,
        runloop: { status },
      },
      canvas: { colours, drawTracers },
      page: { canvas, wasm },
    } = fetch()

    if (wasm.status !== "loaded" || canvas.status !== "loaded") {
      return
    }

    const { fps: fpsTarget, dots } = Gears[speed]
    const { RequestDrawingInstructions } = wasm.exports
    const { draw } = canvas.render

    const approxWait = 800 / fpsTarget
    const res = RequestDrawingInstructions(DRAWING_OPTIONS)
    if (res.type === "error") {
      return console.error(res.error)
    }
    draw(res.value, colours, status !== "before-start", drawTracers === "on")
    newStatistics(fps, dots)(fetch, dispatch)
    if (fpsTarget < 60) {
      await sleep(approxWait - t())
    }
  })

export const NewCanvas = (canvas: HTMLCanvasElement): TA => (
  fetch,
  dispatch,
) => {
  const ctx = canvas.getContext("webgl2", {
    antialias: false,
    stencil: false,
    depth: false,
  })
  if (!ctx) {
    return dispatch({ type: "no-webgl2" })
  }
  const render = NewRenderer(ctx)
  dispatch({ type: "canvas-loaded", render })
  setTimeout(() => redrawCanvas(fetch))
}

export const WasmLoaded = (exports: GoExports): TA => (fetch, dispatch) => {
  dispatch({ type: "wasm-loaded", exports })
  setTimeout(() => redrawCanvas(fetch))
}

export const NewPolygon = (value: Polygon): TA => (fetch, dispatch) => {
  const {
    game: { runloop },
    page: { wasm },
  } = fetch()
  if (wasm.status !== "loaded") {
    return
  }
  if (runloop.status === "running") {
    runloop.stop()
  }
  dispatch({ type: "end-game" })
  const { NewVertices } = wasm.exports
  const res = NewVertices(value)
  if (res.type === "error") {
    return console.error(res.error)
  }
  dispatch({ type: "new-polygon", polygon: value })
  setTimeout(() => redrawCanvas(fetch))
}

export const NewRestriction = (value: Restriction): TA => (fetch, dispatch) => {
  const { wasm } = fetch().page
  if (wasm.status !== "loaded") {
    return
  }
  const { NewRestriction } = wasm.exports
  const res = NewRestriction(value)
  if (res.type === "error") {
    return console.error(res.error)
  }
  dispatch({ type: "new-jump-func", rule: value })
}

export const NewCompression = (value: number): TA => (fetch, dispatch) => {
  const { wasm } = fetch().page
  if (wasm.status !== "loaded") {
    return
  }
  const { NewCompression } = wasm.exports
  const res = NewCompression(value)
  if (res.type === "error") {
    return console.error(res.error)
  }
  dispatch({ type: "new-compression", compression: value })
}

export const NewSpeed = (value: Speed): TA => (fetch, dispatch) => {
  const { wasm } = fetch().page
  if (wasm.status !== "loaded") {
    return
  }
  const { NewDots } = wasm.exports
  const res = NewDots(Gears[value].dots)
  if (res.type === "error") {
    return console.error(res.error)
  }
  dispatch({ type: "new-speed", value })
}

export const NewVertex = (value: [number, number]): TA => (fetch, dispatch) => {
  const {
    page: { wasm },
    game: { runloop },
  } = fetch()
  if (wasm.status !== "loaded") {
    return
  }
  const { NewVertex } = wasm.exports

  const res = NewVertex(value, runloop.status === "before-start")
  if (res.type === "error") {
    return console.error(res.error)
  }

  switch (runloop.status) {
    case "before-start": {
      const stop = run(fetch, dispatch)
      return dispatch({ type: "start-game", stop })
    }
    case "paused": {
      const stop = run(fetch, dispatch)
      return dispatch({ type: "start-game", stop })
    }
    case "running": {
      runloop.stop()
      return dispatch({ type: "pause-game" })
    }
  }
}

export const NewDrawTracer = (value: "on" | "off"): TA => (fetch, dispatch) => {
  dispatch({ type: "draw-tracers", value })
  redrawLastFrame(fetch)
}

export const NewFrameSize = (): TA => (fetch, dispatch) =>
  redrawLastFrame(fetch)

export const ResetGame = (): TA => (fetch, dispatch) => {
  const {
    game: { runloop },
  } = fetch()
  if (runloop.status === "running") {
    runloop.stop()
  }

  dispatch({ type: "end-game" })
  setTimeout(() => redrawCanvas(fetch))
}

export const NewPreset = (preset: Preset): TA => (fetch, dispatch) => {
  const { polygon, restriction, compression, colourA, colourB } = preset
  dispatch({ type: "colour-update", location: "colourA", colour: colourA })
  dispatch({ type: "colour-update", location: "colourB", colour: colourB })
  NewRestriction(restriction)(fetch, dispatch)
  NewCompression(compression)(fetch, dispatch)
  NewPolygon(polygon)(fetch, dispatch)
}

export const PageLoaded = (presets: Preset[]): TA => (fetch, dispatch) => {
  const preset = choice(presets)!
  const {
    game: { speed },
  } = fetch()
  NewSpeed(speed)(fetch, dispatch)
  NewPreset(preset)(fetch, dispatch)
}

export const NewDownload = (): TA => async (fetch, dispatch) => {
  const {
    page: { canvas },
  } = fetch()
  if (canvas.status !== "loaded") {
    return
  }
  const { screenshot } = canvas.render
  download(screenshot(), `${String(Math.random()).replace(".", "")}.png`)
}

export const NewRecording = (): TA => (fetch, dispatch) => {
  const {
    recording,
    page: { canvas },
  } = fetch()

  if (canvas.status !== "loaded") {
    return
  }
  const { stream } = canvas.render

  switch (recording.status) {
    case "recording": {
      const { recorder } = recording
      recorder.stop()
      return dispatch({ type: "end-recording" })
    }
    case "not-recording": {
      const recorder = NewRecorder(
        stream(),
        { mimeType: "video/webm" },
        (blob) => {
          const uri = URL.createObjectURL(blob)
          download(uri, `${String(Math.random()).replace(".", "")}.webm`)
          setTimeout(() => URL.revokeObjectURL(uri))
        },
      )
      recorder.start()
      return dispatch({ type: "start-recording", recorder })
    }
  }
}
