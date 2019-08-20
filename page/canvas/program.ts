type Shader = {
  type: "vertex" | "fragment"
  source: string
}

const attachShader = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  { type, source }: Shader,
) => {
  const shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  console.assert(gl.getShaderInfoLog(shader) === "")
  gl.attachShader(program, shader)
  gl.deleteShader(shader)
}

export const NewProgram = (
  gl: WebGL2RenderingContext,
  { vsh, fsh }: { vsh: string; fsh: string },
) => {
  const program = gl.createProgram()!
  attachShader(gl, program, { type: "vertex", source: vsh })
  attachShader(gl, program, { type: "fragment", source: fsh })
  gl.linkProgram(program)
  console.assert(gl.getProgramParameter(program, gl.LINK_STATUS))
  console.assert(gl.getProgramInfoLog(program) === "")
  console.assert(gl.getError() === gl.NO_ERROR)

  const use = () => gl.useProgram(program)
  const getUniformLocation = (name: string) => gl.getUniformLocation(program, name)!
  const getAndEnableAttributeLocation = (name: string) => {
    const location = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(location)
    return location
  }
  const remove = () => gl.deleteProgram(program)

  return { use, getUniformLocation, getAndEnableAttributeLocation, remove }
}

export type ShaderProgram = ReturnType<typeof NewProgram>
