import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { AccordionSection } from "./accordion"
import { Asset } from "../domain_agnostic/assets"
import { Classes as _ } from "../domain_agnostic/utils"
import { I18n } from "../domain_agnostic/i18n"

type Props = {
  Lang: I18n
}

export const GameInfo = (props: Props) => {
  const { Lang } = props

  return (
    <AccordionSection id="game-info" defaultShow={true}>
      <a href="#">
        <h5>{Lang("game info")}</h5>
      </a>
      <div className={_(bs.dFlex, bs.flexColumn)}>
        <ul className={_(bs.listGroup, bs.listGroupFlush)}>
          <li className={_(bs.listGroupItem, bs.px0)}>
            <a target="_blank" rel="noopener" href="http://shiftingmind.com/chaosgame/">
              <div className={bs.media}>
                <img className={_(bs.mr3, bs.w25)} src={Asset("hexa.gif")} />
                <div className={bs.mediaBody}>
                  <h4 className={bs.mt0}>{Lang("how does it work")}</h4>
                  <p className={ps.gameInfoLabel}>{Lang("how does it work desc")}</p>
                </div>
              </div>
            </a>
          </li>
          <li className={_(bs.listGroupItem, bs.px0)}>
            <a
              target="_blank"
              rel="noopener"
              href="https://community.wolfram.com/groups/-/m/t/1025180"
            >
              <div className={bs.media}>
                <img className={_(bs.mr3, bs.w25)} src={Asset("wolfram.gif")} />
                <div className={bs.mediaBody}>
                  <h4 className={bs.mt0}>{Lang("mathematica chaos")}</h4>
                  <p className={ps.gameInfoLabel}>{Lang("mathematica chaos desc")}</p>
                </div>
              </div>
            </a>
          </li>
          <li className={_(bs.listGroupItem, bs.px0)}>
            <a target="_blank" rel="noopener" href="http://rectangleworld.com/blog/archives/561">
              <div className={bs.media}>
                <img className={_(bs.mr3, bs.w25)} src={Asset("six_fractals.jpg")} />
                <div className={bs.mediaBody}>
                  <h4 className={bs.mt0}>{Lang("rectangle world")}</h4>
                  <p className={ps.gameInfoLabel}>{Lang("rectangle world desc")}</p>
                </div>
              </div>
            </a>
          </li>
          <li className={_(bs.listGroupItem, bs.px0)}>
            <div className={_(bs.embedResponsive, bs.embedResponsive1By1)}>
              <iframe
                className={_(bs.embedResponsiveItem)}
                src="https://www.youtube.com/embed/kbKtFN71Lfs"
                allow="encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          </li>
          <li className={_(bs.listGroupItem, bs.px0)}>
            <div className={_(bs.embedResponsive, bs.embedResponsive1By1)}>
              <iframe
                className={_(bs.embedResponsiveItem)}
                src="https://www.youtube.com/embed/eJAs9Qr359o?start=97"
                allow="encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          </li>
        </ul>
      </div>
    </AccordionSection>
  )
}
