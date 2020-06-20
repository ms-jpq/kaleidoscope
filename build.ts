#!/usr/bin/env ts-node

import { rm, slurp, spit, mkdir } from "nda/dist/node/fs"
import { join } from "path"
import { call, pipe, SpawnArgs } from "nda/dist/node/sub_process"

const dist_dir = "./dist"

const chdir = () => {
  process.chdir(__dirname)
}

const run = async (args: SpawnArgs) => {
  const code = await call(args)
  if (code != 0) {
    process.exit(code)
  }
}

const main = async () => {
  chdir()
  await rm(dist_dir)
  await mkdir(dist_dir)
  const { code, stdout, stderr } = await pipe({
    cmd: "go",
    args: ["env", "GOROOT"],
  })
  if (code !== 0) {
    throw new Error(stderr.toString())
  }
  const go_root = stdout.toString()
  const js_root = join(go_root.trim(), "misc/wasm/wasm_exec.js")
  const wasm_js = await slurp(js_root)
  await spit(wasm_js, "src/wasm_go.js")
  const env = { ...process.env, GOOS: "js", GOARCH: "wasm" }
  await run({
    cmd: "go",
    args: ["build", "-o", "dist/main.wasm", "src/wasm/main.go"],
    opts: { env },
  })
  const out = (() => {
    if (process.argv[2] === "--dev") {
      return []
    } else {
      return ["--public-url", "/kaleidoscope-page"]
    }
  })()
  await run({
    cmd: "parcel",
    args: ["build", ...out, "src/index.html"],
  })
}

main()

