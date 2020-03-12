export const NewRecorder = (
  stream: MediaStream,
  opts: MediaRecorderOptions,
  callback: (_: Blob) => void,
) => {
  let chunks: Blob[] = []
  const { mimeType } = opts
  const recorder = new MediaRecorder(stream, opts)
  const start = () => recorder.start()
  const stop = () => {
    recorder.stop()
    stream.getTracks().map((track) => track.stop())
  }
  recorder.ondataavailable = ({ data }) => (chunks = [...chunks, data])
  recorder.onstop = () => callback(new Blob(chunks, { type: mimeType }))
  return { start, stop }
}

export type Recorder = ReturnType<typeof NewRecorder>
