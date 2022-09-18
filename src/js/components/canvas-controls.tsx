import { I18n } from "../domain_agnostic/i18n.js"
import { Colour, Store } from "../redux/state.js"
import { NewDrawTracer } from "../redux/thunk-actions.js"
import { AccordionSection } from "./accordion.js"
import { ColourInputGroup } from "./colour-picker.js"
import { cn as _ } from "nda/iso/dom.js"
import React from "react"

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

  const newDrawTracers: InputResponder<HTMLInputElement> = ({
    currentTarget: { checked },
  }) => dispatch(NewDrawTracer(checked ? "on" : "off"))

  return (
    <AccordionSection id="canvas-control" defaultShow={true}>
      <a href="#">
        <h5>{Lang("canvas control")}</h5>
      </a>
      <form>
        <div className={"form-row"}>
          <div className={"col"}>
            <div
              className={_("custom-control", "custom-switch", "form-control")}
            >
              <input
                id="tracer-enable-input"
                className={"custom-control-input"}
                type="checkbox"
                checked={drawTracers === "on"}
                onChange={newDrawTracers}
              />
              <label
                htmlFor="tracer-enable-input"
                className={_(
                  "custom-control-label",
                  "ml-2",
                  "text-nowrap",
                  "clickable",
                )}
              >
                {Lang("tracer enable")}
              </label>
            </div>
          </div>
          <div className={"col"}>
            <ColourInputGroup
              id="colour-tracer"
              label={Lang("tracer")}
              colour={tracer}
              onChange={newTracer}
            />
          </div>
        </div>
        <hr />
        <div className={"form-row"}>
          <div className={"col"}>
            <ColourInputGroup
              id="colour-a"
              label={Lang("colour a")}
              colour={colourA}
              onChange={newColourA}
            />
          </div>
          <div className={"col"}>
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
