import $ from "jquery"
import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { cn as _ } from "nda/dist/isomorphic/dom"
import { I18n } from "../domain_agnostic/i18n"

type Props = {
  Lang: I18n
}

export const OutdatedBrowser = (props: Props) => {
  const { Lang } = props

  const show = (modal: HTMLElement) => $(modal).modal()

  return (
    <aside
      ref={show}
      className={_(bs.modal, bs.fade, bs.show)}
      tabIndex={-1}
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className={_(bs.modalDialog, bs.modalDialogCentered)}>
        <div className={bs.modalContent}>
          <div className={_(bs.modalHeader, bs.dFlex, bs.flexColumn)}>
            <h5 className={bs.modalTitle}>
              {Lang("outdated browser modal title")}
            </h5>
            <h6>{Lang("require webgl2 wasm")}</h6>
          </div>
          <div className={bs.modalBody}>
            <div className={_(bs.dFlex, bs.flexColumn)}>
              <div className={_(bs.dFlex)}>
                <a
                  className={_(
                    ps.outdatedBrowserImg,
                    bs.dFlex,
                    bs.flexColumn,
                    bs.justifyContentCenter,
                  )}
                  target="_blank"
                  rel="noopener"
                  href="https://www.mozilla.org/en-CA/firefox/new/"
                >
                  <img
                    className={_(bs.imgFluid, bs.rounded, bs.w100, bs.hAuto)}
                    src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/master/_assets/firefox.png`}
                  />
                </a>
                <span className={bs.mx4} />
                <a
                  className={_(
                    ps.outdatedBrowserImg,
                    bs.dFlex,
                    bs.flexColumn,
                    bs.justifyContentCenter,
                  )}
                  target="_blank"
                  rel="noopener"
                  href="https://www.google.ca/chrome/"
                >
                  <img
                    className={_(bs.imgFluid, bs.rounded, bs.w100, bs.hAuto)}
                    src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/master/_assets/chrome.png`}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
