import { I18n } from "../domain_agnostic/i18n.js"
import { Store } from "../redux/state.js"
import { cn as _ } from "nda/iso/dom.js"
import React from "react"

type Props = {
  Lang: I18n
  store: Store
}

export const StatisticsTracker = (props: Props) => {
  const {
    store: { fetch },
    Lang,
  } = props
  const {
    statistics: { fps, dotsDrawn },
  } = fetch()
  return (
    <aside
      id="statistics-tracker"
      className={_("d-flex", "flex-column", "text-right", "text-primary")}
    >
      <output className={"text-truncate"}>
        {fps === 0 ? "" : Lang("fps %@", fps.toFixed(1))}
      </output>
      <output className={"text-truncate"}>
        {dotsDrawn === 0 ? "" : Lang("dots drawn %@", dotsDrawn)}
      </output>
    </aside>
  )
}
