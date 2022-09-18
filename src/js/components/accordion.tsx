import { cn as _ } from "nda/iso/dom.js"
import React from "react"

export const Accordion = (props: { children: React.ReactNode }) => (
  <div className={"accordion"}>{props.children}</div>
)

type Props = {
  id: string
  defaultShow: boolean
  children: React.ReactNode
}

export const AccordionSection = (props: Props) => {
  const { id, defaultShow, children } = props
  const [head = <div />, body = <div />] = React.Children.toArray(children)
  return (
    <section key={id} className={_("accordion-section", "card")}>
      <div
        className={_("accordion-header", "card-header", "text-truncate")}
        data-toggle="collapse"
        data-target={`#${id}`}
      >
        {head}
      </div>
      <div
        id={id}
        className={_("card-body", "collapse", { show: defaultShow })}
      >
        {body}
      </div>
    </section>
  )
}
