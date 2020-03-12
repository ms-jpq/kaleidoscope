import bs from "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { cn as _ } from "nda/dist/isomorphic/dom"
import { I18n } from "../domain_agnostic/i18n"

type Props = {
  Lang: I18n
  id: string
}

export const InfoModal = React.forwardRef(
  (props: Props, ref: React.Ref<HTMLElement>) => {
    const { id, Lang } = props

    return (
      <aside id={id} ref={ref} className={_(bs.modal, bs.fade)} tabIndex={-1}>
        <div className={_(bs.modalDialog, bs.modalDialogCentered)}>
          <div className={bs.modalContent}>
            <div className={bs.modalHeader}>
              <h5 className={bs.modalTitle}>{Lang("info modal title")}</h5>
              <button className={bs.close} data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className={bs.modalBody}>
              <article className={_(bs.dFlex, bs.flexColumn)}>
                <section className={bs.mb1}>
                  <h6>{Lang("how do i start")}</h6>
                  <b>{Lang("how do i start desc")}</b>
                </section>
                <section>
                  <h6>{Lang("game params")}</h6>
                  <p>{Lang("game params desc")}</p>
                </section>
                <section>
                  <h6>{Lang("game slow")}</h6>
                  <p>{Lang("game slow desc")}</p>
                </section>
              </article>
            </div>
          </div>
        </div>
      </aside>
    )
  },
)
