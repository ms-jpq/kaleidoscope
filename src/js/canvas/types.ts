export type Viewport = {
  width: number
  height: number
}

export const CanvasViewport = (gl: WebGL2RenderingContext): Viewport => ({
  width: Math.floor(gl.drawingBufferWidth),
  height: Math.floor(gl.drawingBufferHeight),
})

export const ViewportOf = (gl: WebGL2RenderingContext): Viewport => {
  const [, , width, height] = [...gl.getParameter(gl.VIEWPORT)]
  return { width, height }
}
