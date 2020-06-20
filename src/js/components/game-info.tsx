import React from "react"
import { AccordionSection } from "./accordion"
import { cn as _ } from "nda/dist/isomorphic/dom"
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
      <div className={_("d-flex", "flex-column")}>
        <ul className={_("list-group", "list-group-flush")}>
          <li className={_("list-group-item", "px-0")}>
            <a
              target="_blank"
              rel="noopener"
              href="http://shiftingmind.com/chaosgame/"
            >
              <div className={"media"}>
                <img
                  className={_("mr-3", "w-25")}
                  src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexa.gif`}
                />
                <div className={"media-body"}>
                  <h4 className={"mt-0"}>{Lang("how does it work")}</h4>
                  <p className={"game-info-label"}>
                    {Lang("how does it work desc")}
                  </p>
                </div>
              </div>
            </a>
          </li>
          <li className={_("list-group-item", "px-0")}>
            <a
              target="_blank"
              rel="noopener"
              href="https://community.wolfram.com/groups/-/m/t/1025180"
            >
              <div className={"media"}>
                <img
                  className={_("mr-3", "w-25")}
                  src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/wolfram.gif`}
                />
                <div className={"media-body"}>
                  <h4 className={"mt-0"}>{Lang("mathematica chaos")}</h4>
                  <p className={"game-info-label"}>
                    {Lang("mathematica chaos desc")}
                  </p>
                </div>
              </div>
            </a>
          </li>
          <li className={_("list-group-item", "px-0")}>
            <a
              target="_blank"
              rel="noopener"
              href="http://rectangleworld.com/blog/archives/561"
            >
              <div className={"media"}>
                <img
                  className={_("mr-3", "w-25")}
                  src={`https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/six_fractals.jpg`}
                />
                <div className={"media-body"}>
                  <h4 className={"mt-0"}>{Lang("rectangle world")}</h4>
                  <p className={"game-info-label"}>
                    {Lang("rectangle world desc")}
                  </p>
                </div>
              </div>
            </a>
          </li>
          <li className={_("list-group-item", "px-0")}>
            <div className={_("embed-responsive", "embed-responsive-1by1")}>
              <iframe
                className={_("embed-responsive-item")}
                src="https://www.youtube.com/embed/kbKtFN71Lfs"
                allow="encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>
          </li>
          <li className={_("list-group-item", "px-0")}>
            <div className={_("embed-responsive", "embed-responsive-1by1")}>
              <iframe
                className={_("embed-responsive-item")}
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
