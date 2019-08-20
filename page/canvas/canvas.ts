import fragmentShader from "../../shaders/shader.fsh"
import offscreenShader from "../../shaders/offscreen-shader.vsh"
import onscreenShader from "../../shaders/onscreen-shader.vsh"
import { Colours } from "../redux/state"
import { DrawingInstructions, ReleaseDrawingInstructions } from "../interlope"
import { NewColourRenderbuffer, UseArrayBuffer, ColourRenderBuffer } from "./buffers"
import { NewProgram } from "./program"
import { Viewport } from "./types"

const vec2Size = 2
const vec3Size = 3

const screensize = (): Viewport => {
  const size = Math.floor(Math.min(screen.width, screen.height)) * devicePixelRatio
  return {
    width: size,
    height: size,
  }
}

const canvasSize = (): Viewport => {
  const { clientWidth, clientHeight } = document.documentElement
  const size = Math.floor(Math.min(clientWidth, clientHeight))
  return {
    width: size,
    height: size,
  }
}

const initiateA = (gl: WebGL2RenderingContext) => {
  const program = NewProgram(gl, { vsh: offscreenShader, fsh: fragmentShader })
  program.use()
  const vertexCount = program.getUniformLocation("vertexCount")
  const pointSize = program.getUniformLocation("pointSize")
  const colourA = program.getUniformLocation("colourA")
  const colourB = program.getUniformLocation("colourB")
  const vertex = program.getAndEnableAttributeLocation("vertex")

  const drawCanvas = (polygon: Float32Array, colours: Colours) => {
    program.use()
    gl.clearColor(...colours.background)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform4f(colourA, ...colours.polygon)
    gl.uniform4f(colourB, ...colours.polygon)
    UseArrayBuffer(gl, polygon, () => {
      gl.vertexAttribPointer(vertex, vec2Size, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon.length / vec2Size)
    })
  }

  const drawDots = (dots: Float32Array, count: number, colours: Colours) => {
    program.use()
    gl.uniform1f(vertexCount, count)
    gl.uniform1f(pointSize, 1)
    gl.uniform4f(colourA, ...colours.colourA)
    gl.uniform4f(colourB, ...colours.colourB)
    UseArrayBuffer(gl, dots, () => {
      gl.vertexAttribPointer(vertex, vec3Size, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.POINTS, 0, dots.length / vec3Size)
    })
  }

  return {
    drawCanvas,
    drawDots,
  }
}

const initiateB = (gl: WebGL2RenderingContext) => {
  const program = NewProgram(gl, { vsh: onscreenShader, fsh: fragmentShader })
  program.use()
  const colour = program.getUniformLocation("colour")
  const vertex = program.getAndEnableAttributeLocation("vertex")

  const drawTracers = (vertextracers: Float32Array, dottracers: Float32Array, colours: Colours) => {
    program.use()
    gl.uniform4f(colour, ...colours.tracer)
    UseArrayBuffer(gl, vertextracers, () => {
      gl.vertexAttribPointer(vertex, vec2Size, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_FAN, 0, vertextracers.length / vec2Size)
    })
    UseArrayBuffer(gl, dottracers, () => {
      gl.vertexAttribPointer(vertex, vec2Size, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_FAN, 0, dottracers.length / vec2Size)
    })
  }
  return { drawTracers }
}

export const NewRenderer = (gl: WebGL2RenderingContext) => {
  const programA = initiateA(gl)
  const programB = initiateB(gl)

  const resize = (): [Viewport, ColourRenderBuffer, ColourRenderBuffer] => {
    const size = canvasSize()
    return [size, NewColourRenderbuffer(gl, size), NewColourRenderbuffer(gl, size)]
  }

  let [rboSize, rboA, rboB] = resize()

  const initialize = (instructions: DrawingInstructions, colours: Colours) => {
    const {
      polygon: { array: polygon },
    } = instructions
    ;[rboA, rboB].map((rbo) => rbo.remove())
    ;[rboSize, rboA, rboB] = resize()
    rboA.bind("draw")
    programA.drawCanvas(polygon, colours)
    rboA.blit(rboB.fbo(), rboB.viewport())
    rboB.blitToScreen()
    ReleaseDrawingInstructions(instructions)
  }

  const draw = (
    instructions: DrawingInstructions,
    colours: Colours,
    draw: boolean,
    drawTracers: boolean,
  ) => {
    const {
      count,
      dots: { array: dots },
      vertextracers: { array: vertextracers },
      dottracers: { array: dottracers },
    } = instructions
    rboA.bind("draw")
    draw && programA.drawDots(dots, count, colours)
    rboA.blit(rboB.fbo(), rboB.viewport())
    rboB.bind("draw")
    draw && drawTracers && programB.drawTracers(vertextracers, dottracers, colours)
    rboB.blitToScreen()
    ReleaseDrawingInstructions(instructions)
  }

  const redraw = (drawTracers: boolean) => (drawTracers ? rboB : rboA).blitToScreen()

  const screenshot = () => {
    const pixels = rboA.read()
    const canvas = document.createElement("canvas")
    const image = new ImageData(
      Uint8ClampedArray.from(pixels),
      (canvas.width = rboSize.width),
      (canvas.height = rboSize.height),
    )
    const ctx = canvas.getContext("2d")!
    ctx.putImageData(image, 0, 0)
    ctx.globalCompositeOperation = "copy"
    ctx.scale(1, -1)
    ctx.translate(0, -canvas.height)
    ctx.drawImage(canvas, 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = "source-over"
    return canvas.toDataURL()
  }

  const stream = () => gl.canvas["captureStream"]()

  return { stream, initialize, draw, redraw, screenshot }
}

export type Render = ReturnType<typeof NewRenderer>
