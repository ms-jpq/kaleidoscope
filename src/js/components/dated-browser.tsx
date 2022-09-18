import React from "react"
import { cn as _ } from "nda/iso/dom.js"
import { I18n } from "../domain_agnostic/i18n.js"

type Props = {
  Lang: I18n
}

export const OutdatedBrowser = (props: Props) => {
  const { Lang } = props

  const show = (modal: HTMLElement) => $(modal).modal()

  return (
    <aside
      ref={show}
      className={_("modal", "fade", "show")}
      tabIndex={-1}
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className={_("modal-dialog", "modal-dialog-centered")}>
        <div className={"modal-content"}>
          <div className={_("modal-header", "d-flex", "flex-column")}>
            <h5 className={"modal-title"}>
              {Lang("outdated browser modal title")}
            </h5>
            <h6>{Lang("require webgl2 wasm")}</h6>
          </div>
          <div className={"modal-body"}>
            <div className={_("d-flex", "flex-column")}>
              <div className={_("d-flex")}>
                <a
                  className={_(
                    "outdated-browser-img",
                    "d-flex",
                    "flex-column",
                    "justify-content-center",
                  )}
                  target="_blank"
                  rel="noopener"
                  href="https://www.mozilla.org/en-CA/firefox/new/"
                >
                  <img
                    className={_("img-fluid", "rounded", "w-100", "h-auto")}
                    src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/firefox.png`}
                  />
                </a>
                <span className={"mx-4"} />
                <a
                  className={_(
                    "outdated-browser-img",
                    "d-flex",
                    "flex-column",
                    "justify-content-center",
                  )}
                  target="_blank"
                  rel="noopener"
                  href="https://www.google.ca/chrome/"
                >
                  <img
                    className={_("img-fluid", "rounded", "w-100", "h-auto")}
                    src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/chrome.png`}
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
