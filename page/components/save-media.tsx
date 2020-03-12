import bs from "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { Classes as _ } from "../domain_agnostic/utils"
import { I18n } from "../domain_agnostic/i18n"
import { NewDownload, NewRecording } from "../redux/thunk-actions"
import { Store } from "../redux/state"

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
    <div id="save-media" className={_(bs.dFlex, bs.flexColumn)}>
      <button
        className={_(bs.btn, bs.btnOutlinePrimary, {
          [bs.active]: status === "recording",
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
      <span className={bs.my1} />
      <button
        className={_(bs.btn, bs.btnOutlineInfo)}
        data-toggle="tooltip"
        title={Lang("download tooltip")}
        onClick={onDownloadButton}
      >
        <em>{Lang("download")}</em>
      </button>
    </div>
  )
}
