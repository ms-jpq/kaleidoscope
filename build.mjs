#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { mkdir, rm, writeFile, readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { chdir, exit } from "node:process"
import { fileURLToPath } from "node:url"

const top_level = dirname(fileURLToPath(new URL(import.meta.url)))
const dist_dir = join(top_level, "dist")

/**
 * @param {{ env?: NodeJS.ProcessEnv }} opts
 * @param {string} arg0
 * @param {string[]} argv
 */
const run = ({ env }, arg0, ...argv) => {
  const { error, status } = spawnSync(arg0, argv, { stdio: "inherit", env })
  if (error) {
    throw error
  }
  const code = status ?? 1
  if (code) {
    exit(code)
  }
}

const main = async () => {
  chdir(top_level)
  await rm(dist_dir, { recursive: true, force: true })
  await mkdir(dist_dir, { recursive: true })
  const stdout = (() => {
    const { error, status, stdout } = spawnSync("go", ["env", "GOROOT"], {
      stdio: ["inherit", "pipe", "inherit"],
    })

    if (error) {
      throw error
    }
    const code = status ?? 1
    if (code) {
      exit(code)
    }
    return stdout
  })()

  const go_root = stdout.toString()
  const js_root = join(go_root.trim(), "misc/wasm/wasm_exec.js")
  const wasm_js = await readFile(js_root)
  await writeFile("src/wasm_go.js", wasm_js)
  const env = { ...process.env, GOOS: "js", GOARCH: "wasm" }
  run({ env }, "go", "build", "-o", "dist/main.wasm", "src/wasm/main.go")
  const out = (() => {
    if (process.argv[2] === "--dev") {
      return []
    } else {
      return ["--base", "/kaleidoscope-page"]
    }
  })()
  run(
    {},
    "vite",
    "build",
    "--config",
    join(top_level, "vite.config.js"),
    ...out,
    join(top_level, "src"),
  )
}

main()
