import { GoExports } from "../interlope"
import { Recorder } from "../domain_agnostic/recorder"
import { Polygon, Restriction, Speed } from "../game-constants"
import { Render } from "../canvas/canvas"
import {
  ApplyReducers,
  CombineReducers,
  NewStore,
  NewThunkMiddleware,
  Reducer,
  ThunkAction,
} from "../domain_agnostic/simple-redux"

export type Colour = [number, number, number, number]
export type ColourLocation =
  | "colourA"
  | "colourB"
  | "tracer"
  | "polygon"
  | "background"
export type Colours = Record<ColourLocation, Colour>

export type State = {
  game: {
    runloop:
      | { status: "before-start" }
      | { status: "paused" }
      | { status: "running"; stop: () => void }
    polygon: Polygon
    jumpFunction: Restriction
    compression: number
    speed: Speed
  }
  canvas: {
    drawTracers: "on" | "off"
    colours: Colours
  }
  page: {
    canvas:
      | { status: "loading" }
      | { status: "loaded"; render: Render }
      | { status: "failed" }
    wasm:
      | { status: "loading" }
      | { status: "loaded"; exports: GoExports }
      | { status: "failed" }
  }
  statistics: {
    fps: number
    dotsDrawn: number
  }
  recording:
    | { status: "not-recording" }
    | { status: "recording"; recorder: Recorder }
}

type GameAction =
  | {
      type: "new-polygon"
      polygon: Polygon
    }
  | {
      type: "new-jump-func"
      rule: Restriction
    }
  | {
      type: "new-compression"
      compression: number
    }
  | {
      type: "new-speed"
      value: number
    }
  | {
      type: "start-game"
      stop: () => void
    }
  | {
      type: "pause-game"
    }
  | {
      type: "end-game"
    }

type CanvasAction =
  | {
      type: "new-framesize"
    }
  | {
      type: "colour-update"
      location: ColourLocation
      colour: Colour
    }
  | {
      type: "draw-tracers"
      value: "on" | "off"
    }

type PageAction =
  | { type: "DOM-loaded" }
  | {
      type: "canvas-loaded"
      render: Render
    }
  | {
      type: "wasm-loaded"
      exports: GoExports
    }
  | {
      type: "no-webgl2"
    }

type StatisticsAction = {
  type: "statistics-update"
  fps: number
  dotsDrawn: number
}

type RecordingAction =
  | {
      type: "start-recording"
      recorder: Recorder
    }
  | {
      type: "end-recording"
    }

export type Action =
  | GameAction
  | CanvasAction
  | PageAction
  | StatisticsAction
  | RecordingAction

const gameReducer: Reducer<State["game"], GameAction> = (state, action) => {
  const newState = { ...state }
  switch (action.type) {
    case "new-polygon":
      newState.polygon = action.polygon
      break
    case "new-jump-func":
      newState.jumpFunction = action.rule
      break
    case "new-compression":
      newState.compression = action.compression
      break
    case "new-speed":
      newState.speed = action.value
      break
    case "start-game":
      newState.runloop = { status: "running", stop: action.stop }
      break
    case "pause-game":
      newState.runloop = { status: "paused" }
      break
    case "end-game":
      newState.runloop = { status: "before-start" }
      break
  }
  return newState
}

const canvasReducer: Reducer<State["canvas"], CanvasAction> = (
  state,
  action,
) => {
  const newState = { ...state }
  switch (action.type) {
    case "colour-update":
      newState.colours[action.location] = action.colour
      break
    case "draw-tracers":
      newState.drawTracers = action.value
      break
  }
  return newState
}

const pageReducer: Reducer<State["page"], PageAction> = (state, action) => {
  const newState = { ...state }
  switch (action.type) {
    case "no-webgl2":
      newState.canvas = { status: "failed" }
      break
    case "canvas-loaded":
      newState.canvas = { status: "loaded", render: action.render }
      break
    case "wasm-loaded":
      newState.wasm = { status: "loaded", exports: action.exports }
  }
  return newState
}

const statisticsReducer: Reducer<State["statistics"], Action> = (
  state,
  action,
) => {
  const newState = { ...state }
  switch (action.type) {
    case "end-game":
      newState.fps = 0
      newState.dotsDrawn = 0
      break
  }
  return newState
}

const recordingReducer: Reducer<State["recording"], RecordingAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "start-recording":
      return { status: "recording", recorder: action.recorder }
    case "end-recording":
      return { status: "not-recording" }
  }
  return state
}

const reducer: Reducer<State, Action> = (state, action) => {
  const newState = { ...state }
  switch (action.type) {
    case "statistics-update":
      const {
        game: {
          runloop: { status },
        },
        statistics: { dotsDrawn: oldDots },
      } = state
      const fps = status !== "running" ? 0 : action.fps
      const dotsDrawn =
        status === "before-start" ? 0 : oldDots + action.dotsDrawn
      newState.statistics = { fps, dotsDrawn }
      break
  }
  return newState
}

export const NewStateStore = (defaultState: State) =>
  NewStore<State, Action | ThunkAction<State, Action>>(
    defaultState,
    ApplyReducers(
      CombineReducers({
        game: gameReducer,
        canvas: canvasReducer,
        page: pageReducer,
        statistics: statisticsReducer,
        recording: recordingReducer,
      }),
      reducer,
    ),
    NewThunkMiddleware({}),
  )

export type Store = ReturnType<typeof NewStateStore>
