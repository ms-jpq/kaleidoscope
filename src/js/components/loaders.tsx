import { cn as _ } from "nda/iso/dom.js"
import React from "react"

export const Loaders = () => {
  return (
    <div
      className={_(
        "flex-grow-1",
        "w-100",
        "h-100",
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-content-center",
      )}
    >
      <div className={_("d-flex", "justify-content-center")}>
        <div className={_("spinner-grow", "text-primary")} />
        <div className={_("spinner-grow", "text-secondary")} />
        <div className={_("spinner-grow", "text-success")} />
        <div className={_("spinner-grow", "text-danger")} />
        <div className={_("spinner-grow", "text-warning")} />
        <div className={_("spinner-grow", "text-info")} />
        <div className={_("spinner-grow", "text-dark")} />
      </div>
    </div>
  )
}
