import { I18n } from "../domain_agnostic/i18n.js"
import { Preset } from "../game-constants.js"
import { Store } from "../redux/state.js"
import { NewPreset } from "../redux/thunk-actions.js"
import { cn as _ } from "nda/iso/dom.js"
import React from "react"

type Props = {
  store: Store
  Lang: I18n
}

type DProps = {
  preset: Preset
}
type DCProps = {
  presets: Preset[]
}

const Display = (props: DProps & Props) => {
  const {
    store: { dispatch },
    preset,
  } = props

  const { image } = preset

  const onClick = () => dispatch(NewPreset(preset))

  return (
    <li className={_("list-group-item", "p-2")}>
      <div className={_("card", "clickable")} onClick={onClick}>
        <img className={_("card-img")} src={image} />
      </div>
    </li>
  )
}

export const DisplayCase = (props: DCProps & Props) => {
  const { Lang, store, presets } = props

  return (
    <div className={_("d-flex", "flex-column", "py-2", "bg-light", "w-100")}>
      <section className={"w-100"}>
        <h4 className={"text-center"}>{Lang("presets")}</h4>
      </section>
      <ul
        className={_(
          "list-group",
          "list-group-flush",
          "w-100",
          "overflow-auto",
        )}
      >
        {presets.map((preset) => (
          <Display
            Lang={Lang}
            key={preset.image}
            store={store}
            preset={preset}
          />
        ))}
      </ul>
    </div>
  )
}
