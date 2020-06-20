import { Colour, State } from "./redux/state"
import { range } from "nda/dist/isomorphic/iterator"

export enum Polygon {
  triangle = 3,
  square = 4,
  pentagon = 5,
  hexagon = 6,
  heptagon = 7,
  octagon = 8,
  nonagon = 9,
  decagon = 10,
  hendecagon = 11,
  dodecagon = 12,
}

export const Polygons: Polygon[] = Object.values(Polygon).filter(
  (v) => typeof v === "number",
) as any

export enum Speed {
  slowest,
  slower,
  slow,
  normal,
  fast,
  ridiculous,
  ludicrous,
}

export const Speeds: Speed[] = [...range(Speed.slowest, Speed.ludicrous)]

export const Gears: Record<Speed, { dots: number; fps: number }> = {
  [Speed.slowest]: { dots: 1, fps: 2 },
  [Speed.slower]: { dots: 1, fps: 10 },
  [Speed.slow]: { dots: 1, fps: 30 },
  [Speed.normal]: { dots: 25, fps: 60 },
  [Speed.fast]: { dots: 50, fps: 60 },
  [Speed.ridiculous]: { dots: 200, fps: 60 },
  [Speed.ludicrous]: { dots: 1000, fps: 60 },
}

export enum Restriction {
  none,
  force_CW,

  noSameDir,
  last_noSameDir,

  noAdjacent_exclusive,
  last_noAdjacent_exclusive,

  noAcross,
  last_noAcross,

  noAdjacent_inclusive,
  last_noAdjacent_inclusive,
}

export const AllowableRestrictions: Record<Polygon, Restriction[]> = {
  "3": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
  ],
  "4": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "5": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "6": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "7": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "8": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "9": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "10": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "11": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
  "12": [
    Restriction.none,
    Restriction.force_CW,
    Restriction.noSameDir,
    Restriction.last_noSameDir,
    Restriction.noAcross,
    Restriction.last_noAcross,
    Restriction.noAdjacent_exclusive,
    Restriction.last_noAdjacent_exclusive,
    Restriction.noAdjacent_inclusive,
    Restriction.last_noAdjacent_inclusive,
  ],
}

export type Preset = {
  image: string
  polygon: Polygon
  restriction: Restriction
  compression: number
  colourA: Colour
  colourB: Colour
}

export const PRESETS: Preset[] = [
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/sierpinski_triangle.png`,
    polygon: Polygon.triangle,
    restriction: Restriction.none,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/square_noacross_0.5.png`,
    polygon: Polygon.square,
    restriction: Restriction.noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/square_noacross2_0.5.png`,
    polygon: Polygon.square,
    restriction: Restriction.last_noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/square_norepeat_0.5.png`,
    polygon: Polygon.square,
    restriction: Restriction.noSameDir,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/square_norepeat2_0.5.png`,
    polygon: Polygon.square,
    restriction: Restriction.last_noSameDir,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_free_0.4.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.none,
    compression: 0.4,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_free_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.none,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_counterclockwise_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.force_CW,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_noacross_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_noacross2_0.4.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.last_noAcross,
    compression: 0.4,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_noacross2_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.last_noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_noajacent_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.noAdjacent_exclusive,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/pentagon_noajacent2_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.last_noAdjacent_exclusive,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/petagon_norepeat_0.5.png`,
    polygon: Polygon.pentagon,
    restriction: Restriction.noSameDir,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_free_0.35.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.none,
    compression: 0.35,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_free_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.none,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_ccw_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.force_CW,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_noacross_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_noacross2_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.last_noAcross,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_noajacent_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.noAdjacent_exclusive,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_norepeat_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.noSameDir,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_norepeat2_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.last_noSameDir,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
  {
    image: `https://raw.githubusercontent.com/ms-jpq/Kaleidoscope/kaleidoscope/_assets/hexagon_trial2_0.5.png`,
    polygon: Polygon.hexagon,
    restriction: Restriction.last_noAdjacent_inclusive,
    compression: 0.5,
    colourA: [0, 1, 1, 1],
    colourB: [1, 0.08, 0.58, 1],
  },
]

export const DEFAULT_STATE: State = {
  game: {
    polygon: Polygon.triangle,
    jumpFunction: Restriction.none,
    compression: 0.5,
    speed: Speed.normal,
    runloop: { status: "before-start" },
  },
  canvas: {
    drawTracers: "on",
    colours: {
      colourA: [0, 1, 1, 1],
      colourB: [1, 0.08, 0.58, 1],
      tracer: [1, 1, 0, 1],
      polygon: [0, 0, 0, 1],
      background: [1, 1, 1, 0],
    },
  },
  page: {
    canvas: { status: "loading" },
    wasm: { status: "loading" },
  },
  statistics: {
    fps: 0,
    dotsDrawn: 0,
  },
  recording: { status: "not-recording" },
}

