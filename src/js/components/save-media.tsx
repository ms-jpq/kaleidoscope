import { I18n } from "../domain_agnostic/i18n.js"
import { Store } from "../redux/state.js"
import { NewDownload, NewRecording } from "../redux/thunk-actions.js"
import { cn as _ } from "nda/iso/dom.js"
import React from "react"

type Props = {
  Lang: I18n
  store: Store
}

export const SaveMedia = (props: Props) => {
  const {
    Lang,
    store: { fetch, dispatch },
  } = props
  const { status } = fetch().recording

  const onRecordButton = () => dispatch(NewRecording())

  const onDownloadButton = () => dispatch(NewDownload())

  return (
    <div id="save-media" className={_("d-flex", "flex-column")}>
      <button
        className={_("btn", "btn-outline-primary", {
          active: status === "recording",
        })}
        data-toggle="tooltip"
        title={Lang("recording tooltip")}
        onClick={onRecordButton}
      >
        <em>
          {status === "recording"
            ? Lang("recording inprogress")
            : Lang("recording")}
        </em>
      </button>
      <span className={"my-1"} />
      <button
        className={_("btn", "btn-outline-info")}
        data-toggle="tooltip"
        title={Lang("download tooltip")}
        onClick={onDownloadButton}
      >
        <em>{Lang("download")}</em>
      </button>
    </div>
  )
}
