import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { cn as _ } from "nda/dist/isomorphic/dom"

export const Accordion = (props: { children: React.ReactNode }) => (
  <div className={bs.accordion}>{props.children}</div>
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
    <section key={id} className={_(ps.accordionSection, bs.card)}>
      <div
        className={_(ps.accordionHeader, bs.cardHeader, bs.textTruncate)}
        data-toggle="collapse"
        data-target={`#${id}`}
      >
        {head}
      </div>
      <div
        id={id}
        className={_(bs.cardBody, bs.collapse, { show: defaultShow })}
      >
        {body}
      </div>
    </section>
  )
}
