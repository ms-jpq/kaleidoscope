import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { AccordionSection } from "./accordion"
import { Classes as _ } from "../domain_agnostic/utils"
import { Colour, Store } from "../redux/state"
import { ColourInputGroup } from "./colour-picker"
import { I18n } from "../domain_agnostic/i18n"
import { NewDrawTracer } from "../redux/thunk-actions"

type Props = {
  Lang: I18n
  store: Store
}

type NewColour = (_: Colour) => void
type InputResponder<T> = (_: React.FormEvent<T>) => void

export const CanvasControl = (props: Props) => {
  const {
    Lang,
    store: { fetch, dispatch },
  } = props
  const {
    canvas: {
      drawTracers,
      colours: { tracer, colourA, colourB },
    },
  } = fetch()

  const newColourA: NewColour = (colour) =>
    dispatch({ type: "colour-update", location: "colourA", colour })

  const newColourB: NewColour = (colour) =>
    dispatch({ type: "colour-update", location: "colourB", colour })

  const newTracer: NewColour = (colour) =>
    dispatch({ type: "colour-update", location: "tracer", colour })

  const newDrawTracers: InputResponder<HTMLInputElement> = ({ currentTarget: { checked } }) =>
    dispatch(NewDrawTracer(checked ? "on" : "off"))

  return (
    <AccordionSection id="canvas-control" defaultShow={true}>
      <a href="#">
        <h5>{Lang("canvas control")}</h5>
      </a>
      <form>
        <div className={bs.formRow}>
          <div className={bs.col}>
            <div className={_(bs.customControl, bs.customSwitch, bs.formControl)}>
              <input
                id="tracer-enable-input"
                className={bs.customControlInput}
                type="checkbox"
                checked={drawTracers === "on"}
                onChange={newDrawTracers}
              />
              <label
                htmlFor="tracer-enable-input"
                className={_(bs.customControlLabel, bs.ml2, bs.textNowrap, ps.clickable)}
              >
                {Lang("tracer enable")}
              </label>
            </div>
          </div>
          <div className={bs.col}>
            <ColourInputGroup
              id="colour-tracer"
              label={Lang("tracer")}
              colour={tracer}
              onChange={newTracer}
            />
          </div>
        </div>
        <hr />
        <div className={bs.formRow}>
          <div className={bs.col}>
            <ColourInputGroup
              id="colour-a"
              label={Lang("colour a")}
              colour={colourA}
              onChange={newColourA}
            />
          </div>
          <div className={bs.col}>
            <ColourInputGroup
              id="colour-b"
              label={Lang("colour b")}
              colour={colourB}
              onChange={newColourB}
            />
          </div>
        </div>
      </form>
    </AccordionSection>
  )
}
