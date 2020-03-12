fs = os = crypto = util = undefined
WebAssembly.instantiateStreaming =
  WebAssembly.instantiateStreaming ||
  (async (res, opts) => WebAssembly.instantiate(await (await res).arrayBuffer(), opts))
