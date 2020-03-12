import bs from "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { cn as _ } from "nda/dist/isomorphic/dom"
import { I18n } from "../domain_agnostic/i18n"
import { Store } from "../redux/state"

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
      className={_(bs.dFlex, bs.flexColumn, bs.textRight, bs.textPrimary)}
    >
      <output className={bs.textTruncate}>
        {fps === 0 ? "" : Lang("fps %@", fps.toFixed(1))}
      </output>
      <output className={bs.textTruncate}>
        {dotsDrawn === 0 ? "" : Lang("dots drawn %@", dotsDrawn)}
      </output>
    </aside>
  )
}
