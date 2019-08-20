import { CanvasViewport, Viewport } from "./types"

export type FrameBufferTarget = "read" | "draw" | "both"

export const NewFramebuffer = (gl: WebGL2RenderingContext) => {
  const framebuffer = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  console.assert(gl.getError() === gl.NO_ERROR)
  const bind = (target: FrameBufferTarget) => {
    switch (target) {
      case "read":
        return gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer)
      case "draw":
        return gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer)
      case "both":
        return gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    }
  }
  const self = () => framebuffer
  const remove = () => gl.deleteFramebuffer(framebuffer)
  return { bind, self, remove }
}

export type FrameBuffer = ReturnType<typeof NewFramebuffer>

export const NewRenderbuffer = (gl: WebGL2RenderingContext, { width, height }: Viewport) => {
  const renderbuffer = gl.createRenderbuffer()!
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGB5_A1, width, height)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer)
  console.assert(gl.isRenderbuffer(renderbuffer))
  console.assert(gl.getError() === gl.NO_ERROR)
  const bind = () => gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
  const remove = () => gl.deleteRenderbuffer(renderbuffer)
  return { bind, remove }
}

export type RenderBuffer = ReturnType<typeof NewRenderbuffer>

export const NewColourRenderbuffer = (gl: WebGL2RenderingContext, { width, height }: Viewport) => {
  const framebuffer = NewFramebuffer(gl)
  const renderbuffer = NewRenderbuffer(gl, { width, height })
  console.assert(gl.getError() === gl.NO_ERROR)
  const fbo = () => framebuffer.self()
  const viewport = () => ({ width, height })
  const bind = (target: FrameBufferTarget) => {
    gl.viewport(0, 0, width, height)
    framebuffer.bind(target)
  }
  const blit = (dest: WebGLFramebuffer | null, { width: w, height: h }: Viewport) => {
    bind("read")
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, dest)
    gl.blitFramebuffer(0, 0, width, height, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST)
  }
  const blitToScreen = () => blit(null, CanvasViewport(gl))
  const read = () => {
    const dest = new Uint8Array(width * height * 4)
    bind("read")
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, dest)
    return dest
  }
  const remove = () => {
    framebuffer.remove()
    renderbuffer.remove()
  }
  return { fbo, viewport, bind, blit, blitToScreen, read, remove }
}

export type ColourRenderBuffer = ReturnType<typeof NewColourRenderbuffer>

export const UseArrayBuffer = (
  gl: WebGL2RenderingContext,
  data: Float32Array,
  draw: () => void,
) => {
  const buffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  draw()
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.deleteBuffer(buffer)
}
