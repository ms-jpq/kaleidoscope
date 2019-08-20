import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { Classes as _ } from "../domain_agnostic/utils"
import { I18n } from "../domain_agnostic/i18n"
import { NewPreset } from "../redux/thunk-actions"
import { Preset } from "../game-constants"
import { Store } from "../redux/state"

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
    <li className={_(bs.listGroupItem, bs.p2)}>
      <div className={_(bs.card, ps.clickable)} onClick={onClick}>
        <img className={_(bs.cardImg)} src={image} />
      </div>
    </li>
  )
}

export const DisplayCase = (props: DCProps & Props) => {
  const { Lang, store, presets } = props

  return (
    <div className={_(bs.dFlex, bs.flexColumn, bs.py2, bs.bgLight, bs.w100)}>
      <section className={bs.w100}>
        <h4 className={bs.textCenter}>{Lang("presets")}</h4>
      </section>
      <ul className={_(bs.listGroup, bs.listGroupFlush, bs.w100, bs.overflowAuto)}>
        {presets.map((preset) => (
          <Display Lang={Lang} key={preset.image} store={store} preset={preset} />
        ))}
      </ul>
    </div>
  )
}
