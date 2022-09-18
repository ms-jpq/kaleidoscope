//@ts-ignore
import Huebee from "huebee"
import { Colour } from "../redux/state.js"
import { cn as _ } from "nda/iso/dom.js"
import { $ as $_ } from "nda/web/dom.js"
import React from "react"

const Hex = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
}

type HexType = typeof Hex

const RevHex: Record<HexType[keyof HexType], keyof HexType> = Object.entries(
  Hex,
).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {})

type Props = {
  id: string
  colour: Colour
  onChange: (_: Colour) => void
}

export const ColourPicker = (props: Props) => {
  const inputRef = React.createRef<HTMLInputElement>()
  const { id, colour } = props
  const [R, G, B] = colour.map((c) => Math.round(c * 255))
  let bee: Huebee

  React.useEffect(() => {
    const input = inputRef.current!
    $(input)
      .popover({})
      .on("inserted.bs.popover", () => {
        if (bee) {
          return
        }
        const { colour, onChange } = props
        const [R, G, B] = colour.map((c) => RevHex[Math.round(c * 15)])
        const id = input.getAttribute("aria-describedby")
        const popup = $_(`#${id} .popover-body`)
        bee = new Huebee(popup, {
          staticOpen: true,
          setText: false,
          setBGColor: false,
          saturations: 2,
        })
        bee.setColor(`#${[R, G, B].join("")}`)
        bee.on("change", (hex: string) => {
          const [, R, G, B] = hex
            .split("")
            .map((c) => Hex[c as keyof typeof Hex]! / 15)
          onChange([R!, G!, B!, 1])
        })
      })
  }, [])

  return (
    <input
      id={id}
      ref={inputRef}
      className={_("colour-picker", "clickable", "form-control")}
      style={{ backgroundColor: `rgb(${R}, ${G}, ${B})` }}
      data-trigger="focus"
      data-boundary="viewport"
      data-content=" "
      readOnly
    />
  )
}

type PProps = {
  label: string
}

export const ColourInputGroup = (props: PProps & Props) => {
  const { label, colour, onChange, id } = props
  return (
    <div className={_("input-group", "flex-nowrap")}>
      <div className={_("input-group-prepend", "flex-grow-1")}>
        <label
          htmlFor={id}
          className={_("input-group-text", "flex-grow-1", "clickable")}
        >
          {label}
        </label>
      </div>
      <ColourPicker id={id} colour={colour} onChange={onChange} />
    </div>
  )
}
