import { I18n } from "../domain_agnostic/i18n.js"
import { Between } from "../domain_agnostic/utils.js"
import { Preset } from "../game-constants.js"
import { Store } from "../redux/state.js"
import {
  NewCanvas,
  NewFrameSize,
  NewVertex,
  ResetGame,
} from "../redux/thunk-actions.js"
import { Accordion } from "./accordion.js"
import { CanvasControl } from "./canvas-controls.js"
import { OutdatedBrowser } from "./dated-browser.js"
import { DisplayCase } from "./display-case.js"
import { GameControl } from "./game-controls.js"
import { GameInfo } from "./game-info.js"
import { InfoModal } from "./info-modal.js"
import { Loaders } from "./loaders.js"
import { SaveMedia } from "./save-media.js"
import { StatisticsTracker } from "./statistics-tracker.js"
import { throttle } from "nda/iso/decorator.js"
import { cn as _ } from "nda/iso/dom.js"
import React from "react"

type Props = {
  Lang: I18n
  store: Store
  presets: Preset[]
  resizeThrottle: number
  minLeftPanel: number
  maxLeftPanel: number
  minRightPanel: number
  maxRightPanel: number
}

type MEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>

export const Page = (props: Props) => {
  const canvasRef = React.createRef<HTMLCanvasElement>()
  const leftPanelRef = React.createRef<HTMLDivElement>()
  const rightPanelRef = React.createRef<HTMLDivElement>()
  const splitterLeftRef = React.createRef<HTMLDivElement>()
  const splitterRightRef = React.createRef<HTMLDivElement>()
  const modalRef = React.createRef<HTMLElement>()
  const modalButtonRef = React.createRef<HTMLButtonElement>()

  const {
    Lang,
    store,
    presets,
    minLeftPanel,
    maxLeftPanel,
    minRightPanel,
    maxRightPanel,
    resizeThrottle,
  } = props
  const { fetch, dispatch } = store
  const {
    wasm: { status: wasm },
    canvas: { status: canvas },
  } = fetch().page

  const onMouseDown = ({ clientX, clientY, currentTarget: ct }: MEvent) => {
    const { top, left, bottom, right } = ct.getBoundingClientRect()
    const x = (clientX - left) / (right - left)
    const y = (clientY - top) / (bottom - top)
    const glX = x * 2 - 1
    const glY = y * -2 + 1
    dispatch(NewVertex([glX, glY]))
  }

  const onResetButton = () => dispatch(ResetGame())

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const leftPanel = leftPanelRef.current!
    const splitterLeft = splitterLeftRef.current!
    const splitterRight = splitterRightRef.current!
    const rightPanel = rightPanelRef.current!
    const modal = modalRef.current!
    const modalButton = modalButtonRef.current!
    const { clientWidth } = document.documentElement

    const resize = throttle(
      resizeThrottle,
      ([
        {
          contentRect: { width, height },
        },
      ]: ReadonlyArray<ResizeObserverEntry>) => {
        canvas!.width = width * devicePixelRatio
        canvas!.height = height * devicePixelRatio
        dispatch(NewFrameSize())
      },
    )

    new ResizeObserver(resize).observe(canvas!)

    $(leftPanel!)
      .width(`${clientWidth * minLeftPanel}px`)
      .resizable({ handles: { e: splitterLeft } })
      .on("resize", (_, { size }) => {
        const { clientWidth, clientHeight } = document.documentElement
        size.width = Between(
          clientWidth * minLeftPanel,
          clientWidth * maxLeftPanel,
        )(size.width)
        size.height = Math.min(size.height, clientHeight)
      })

    $(rightPanel!)
      .width(`${clientWidth * minRightPanel}px`)
      .resizable({ handles: { w: splitterRight } })
      .on("resize", (_, { size, position }) => {
        const { clientWidth, clientHeight } = document.documentElement
        position.left = 0
        size.width = Between(
          clientWidth * minRightPanel,
          clientWidth * maxRightPanel,
        )(size.width)
        size.height = Math.min(size.height, clientHeight)
      })

    globalThis.onresize = throttle(
      resizeThrottle,
      ((prevWidth) => () => {
        const { clientWidth } = document.documentElement
        const leftRatio = Between(
          minLeftPanel,
          maxLeftPanel,
        )(leftPanel!.clientWidth / prevWidth)
        const rightRatio = Between(
          minRightPanel,
          maxRightPanel,
        )(rightPanel!.clientWidth / prevWidth)
        leftPanel!.style.width = `${leftRatio * clientWidth}px`
        rightPanel!.style.width = `${rightRatio * clientWidth}px`
        prevWidth = clientWidth
      })(clientWidth),
    )

    dispatch(NewCanvas(canvas))
    $(`[data-toggle="tooltip"]`).tooltip()
    ;(() => {
      const { status } = fetch().page.canvas
      if (status === "failed") {
        return
      }
      $(modal)
        .modal()
        .on("hidden.bs.modal", () => $(modalButton).tooltip("toggle"))
    })()
  }, [])

  return (
    <React.StrictMode>
      <div className={_("vh-100", "vw-100", "d-flex")}>
        <div ref={leftPanelRef} className={_("vh-100", "overflow-auto")}>
          <Accordion>
            <GameControl Lang={Lang} store={store} />
            <CanvasControl Lang={Lang} store={store} />
            <GameInfo Lang={Lang} />
          </Accordion>
        </div>
        <div
          ref={splitterLeftRef}
          className={_(
            "splitter",
            "h-100",
            "ui-resizable-handle",
            "ui-resizable-e",
          )}
        />
        <main
          className={_(
            "h-100",
            "flex-grow-1",
            "d-flex",
            "flex-column",
            "justify-content-center",
            "align-items-center",
            "position-relative",
            {
              waiting: wasm === "loading",
            },
          )}
        >
          <span id="reset-button" data-toggle="tooltip" title={Lang("reset")}>
            <button
              className={_("btn", "btn-outline-danger")}
              onClick={onResetButton}
            >
              <em>{Lang("reset")}</em>
            </button>
          </span>
          <StatisticsTracker Lang={Lang} store={store} />
          <SaveMedia Lang={Lang} store={store} />
          <span
            id="help-tag"
            ref={modalButtonRef}
            className={_("clickable")}
            data-toggle="tooltip"
            title={Lang("help")}
          >
            <button
              className={_("btn", "btn-sm", "btn-outline-secondary")}
              data-toggle="modal"
              data-target="#info-modal"
            >
              <i className="fas fa-2x fa-question-circle" />
            </button>
          </span>
          {wasm === "loading" ? <Loaders /> : undefined}
          <div
            className={_("canvas-container", {
              "d-none": wasm === "loading",
            })}
          >
            <canvas ref={canvasRef} onMouseDown={onMouseDown} />
          </div>
        </main>
        <aside ref={rightPanelRef} className={_("vh-100", "d-flex")}>
          <div
            ref={splitterRightRef}
            className={_(
              "splitter",
              "h-100",
              "ui-resizable-handle",
              "ui-resizable-w",
            )}
          />
          <DisplayCase Lang={Lang} store={store} presets={presets} />
        </aside>
      </div>
      {canvas === "failed" || wasm === "failed" ? (
        <OutdatedBrowser Lang={Lang} />
      ) : undefined}
      <InfoModal ref={modalRef} Lang={Lang} id="info-modal" />
    </React.StrictMode>
  )
}
