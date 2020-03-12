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
      <aside id={id} ref={ref} className={_("modal", "fade")} tabIndex={-1}>
        <div className={_("modal-dialog", "modal-dialog-centered")}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <h5 className={"modal-title"}>{Lang("info modal title")}</h5>
              <button className={"close"} data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className={"modal-body"}>
              <article className={_("d-flex", "flex-column")}>
                <section className={"mb-1"}>
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
