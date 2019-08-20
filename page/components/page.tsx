import $ from "jquery"
import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import ResizeObserver from "resize-observer-polyfill"
import rs from "jquery-ui/themes/base/resizable.css"
import { Accordion } from "./accordion"
import { Between, Classes as _, Throttle } from "../domain_agnostic/utils"
import { CanvasControl } from "./canvas-controls"
import { DisplayCase } from "./display-case"
import { GameControl } from "./game-controls"
import { GameInfo } from "./game-info"
import { I18n } from "../domain_agnostic/i18n"
import { InfoModal } from "./info-modal"
import { Loaders } from "./loaders"
import { NewCanvas, NewFrameSize, NewVertex, ResetGame } from "../redux/thunk-actions"
import { OutdatedBrowser } from "./dated-browser"
import { Preset } from "../game-constants"
import { SaveMedia } from "./save-media"
import { StatisticsTracker } from "./statistics-tracker"
import { Store } from "../redux/state"
import "jquery-ui/ui/widgets/resizable"
import "@fortawesome/fontawesome-free/js/all"
import "bootstrap"

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

    new ResizeObserver(
      Throttle(resizeThrottle, ([{ contentRect: { width, height } }]: ResizeObserverEntry[]) => {
        canvas!.width = width * devicePixelRatio
        canvas!.height = height * devicePixelRatio
        dispatch(NewFrameSize())
      }),
    ).observe(canvas!)

    $(leftPanel!)
      .width(`${clientWidth * minLeftPanel}px`)
      .resizable({ handles: { e: splitterLeft } })
      .on("resize", (_, { size }) => {
        const { clientWidth, clientHeight } = document.documentElement
        size.width = Between(clientWidth * minLeftPanel, clientWidth * maxLeftPanel)(size.width)
        size.height = Math.min(size.height, clientHeight)
      })

    $(rightPanel!)
      .width(`${clientWidth * minRightPanel}px`)
      .resizable({ handles: { w: splitterRight } })
      .on("resize", (_, { size, position }) => {
        const { clientWidth, clientHeight } = document.documentElement
        position.left = 0
        size.width = Between(clientWidth * minRightPanel, clientWidth * maxRightPanel)(size.width)
        size.height = Math.min(size.height, clientHeight)
      })

    globalThis.onresize = Throttle(
      resizeThrottle,
      ((prevWidth) => () => {
        const { clientWidth } = document.documentElement
        const leftRatio = Between(minLeftPanel, maxLeftPanel)(leftPanel!.clientWidth / prevWidth)
        const rightRatio = Between(minRightPanel, maxRightPanel)(
          rightPanel!.clientWidth / prevWidth,
        )
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
      <div className={_(bs.vh100, bs.vw100, bs.dFlex)}>
        <div ref={leftPanelRef} className={_(bs.vh100, bs.overflowAuto)}>
          <Accordion>
            <GameControl Lang={Lang} store={store} />
            <CanvasControl Lang={Lang} store={store} />
            <GameInfo Lang={Lang} />
          </Accordion>
        </div>
        <div
          ref={splitterLeftRef}
          className={_(ps.splitter, bs.h100, rs.uiResizableHandle, rs.uiResizableE)}
        />
        <main
          className={_(
            bs.h100,
            bs.flexGrow1,
            bs.dFlex,
            bs.flexColumn,
            bs.justifyContentCenter,
            bs.alignItemsCenter,
            bs.positionRelative,
            {
              [ps.waiting]: wasm === "loading",
            },
          )}
        >
          <span id="reset-button" data-toggle="tooltip" title={Lang("reset")}>
            <button className={_(bs.btn, bs.btnOutlineDanger)} onClick={onResetButton}>
              <em>{Lang("reset")}</em>
            </button>
          </span>
          <StatisticsTracker Lang={Lang} store={store} />
          <SaveMedia Lang={Lang} store={store} />
          <span
            id="help-tag"
            ref={modalButtonRef}
            className={_(ps.clickable)}
            data-toggle="tooltip"
            title={Lang("help")}
          >
            <button
              className={_(bs.btn, bs.btnSm, bs.btnOutlineSecondary)}
              data-toggle="modal"
              data-target="#info-modal"
            >
              <i className="fas fa-2x fa-question-circle" />
            </button>
          </span>
          {wasm === "loading" ? <Loaders /> : undefined}
          <div className={_(ps.canvasContainer, { [bs.dNone]: wasm === "loading" })}>
            <canvas ref={canvasRef} onMouseDown={onMouseDown} />
          </div>
        </main>
        <aside ref={rightPanelRef} className={_(bs.vh100, bs.dFlex)}>
          <div
            ref={splitterRightRef}
            className={_(ps.splitter, bs.h100, rs.uiResizableHandle, rs.uiResizableW)}
          />
          <DisplayCase Lang={Lang} store={store} presets={presets} />
        </aside>
      </div>
      {canvas === "failed" || wasm === "failed" ? <OutdatedBrowser Lang={Lang} /> : undefined}
      <InfoModal ref={modalRef} Lang={Lang} id="info-modal" />
    </React.StrictMode>
  )
}
