import en from "../_locales/en.json"
import "../wasm_go.js"
import { Page } from "./components/page.js"
import { NewI18n } from "./domain_agnostic/i18n.js"
import { shuffle } from "./domain_agnostic/utils.js"
import { DEFAULT_STATE, PRESETS } from "./game-constants.js"
import { GoExports, Instantiate } from "./interlope.js"
import { NewStateStore } from "./redux/state.js"
import { PageLoaded, WasmLoaded } from "./redux/thunk-actions.js"
import "bootstrap"
import $ from "jquery"
import "jquery-ui-dist/jquery-ui.js"
import React from "react"
import { render } from "react-dom"

//@ts-ignore
globalThis["$"] = globalThis["jQuery"] = $

const go = async () => {
  const { run, retrieve } = await Instantiate("main.wasm")
  run()
  const NewVertices: GoExports["NewVertices"] = retrieve("NewVertices")
  const NewRestriction: GoExports["NewRestriction"] = retrieve("NewRestriction")
  const NewCompression: GoExports["NewCompression"] = retrieve("NewCompression")
  const NewDots: GoExports["NewDots"] = retrieve("NewDots")
  const NewVertex: GoExports["NewVertex"] = retrieve("NewVertex")
  const RequestDrawingInstructions: GoExports["RequestDrawingInstructions"] =
    retrieve("RequestDrawingInstructions")
  return {
    NewVertices,
    NewRestriction,
    NewCompression,
    NewDots,
    NewVertex,
    RequestDrawingInstructions,
  }
}

const main = async () => {
  const randomPresets = shuffle(PRESETS)
  const store = NewStateStore(DEFAULT_STATE)
  ;(async () => {
    const exports = await go()
    store.dispatch(WasmLoaded(exports))
    store.dispatch(PageLoaded(randomPresets))
  })()
  const Lang = NewI18n(en as any, true)
  const div = document.body.appendChild(document.createElement("div"))
  store.subscribe(() =>
    render(
      <Page
        Lang={Lang}
        store={store}
        presets={PRESETS}
        resizeThrottle={50}
        minLeftPanel={0.15}
        maxLeftPanel={0.2}
        minRightPanel={0.15}
        maxRightPanel={0.2}
      />,
      div,
    ),
  )
  store.dispatch({ type: "DOM-loaded" })
}

main()
