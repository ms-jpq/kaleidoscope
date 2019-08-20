import bs from "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { Classes as _ } from "../domain_agnostic/utils"

export const Loaders = () => {
  return (
    <div
      className={_(
        bs.flexGrow1,
        bs.w100,
        bs.h100,
        bs.dFlex,
        bs.flexColumn,
        bs.justifyContentCenter,
        bs.alignContentCenter,
      )}
    >
      <div className={_(bs.dFlex, bs.justifyContentCenter)}>
        <div className={_(bs.spinnerGrow, bs.textPrimary)} />
        <div className={_(bs.spinnerGrow, bs.textSecondary)} />
        <div className={_(bs.spinnerGrow, bs.textSuccess)} />
        <div className={_(bs.spinnerGrow, bs.textDanger)} />
        <div className={_(bs.spinnerGrow, bs.textWarning)} />
        <div className={_(bs.spinnerGrow, bs.textInfo)} />
        <div className={_(bs.spinnerGrow, bs.textDark)} />
      </div>
    </div>
  )
}
