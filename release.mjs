#!/usr/bin/env node
import { filter, map } from "nda/iso/iterator.js"
import { spawnSync } from "node:child_process"
import { lstat, readdir, rm, cp, writeFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { chdir, exit } from "node:process"
import { fileURLToPath } from "node:url"

const top_level = dirname(fileURLToPath(new URL(import.meta.url)))
const time = new Date().toISOString()

const dist_dir = join(top_level, "dist")
const artifacts_dir = join(top_level, "artifacts")
const diff_guarantee = join(artifacts_dir, "build_record.txt")

/**
 * @param {string} path
 */
const is_dir = async (path) => {
  try {
    const stat = await lstat(path)
    return stat.isDirectory()
  } catch {
    return false
  }
}

/**
 * @param {{ cwd?: string }} opts
 * @param {string} arg0
 * @param {string[]} argv
 */
const run = ({ cwd }, arg0, ...argv) => {
  const { error, status } = spawnSync(arg0, argv, { stdio: "inherit", cwd })
  if (error) {
    throw error
  }
  const code = status ?? 1
  if (code) {
    exit(code)
  }
}

const git_clone = async () => {
  if (await is_dir(artifacts_dir)) {
    return
  } else {
    const uri = `git@github.com:ms-jpq/kaleidoscope-page.git`
    run({}, "git", "clone", "--depth=1", uri, artifacts_dir)
  }
}

const git_commit = () => {
  const cwd = artifacts_dir
  const msg = `CI - ${time}`
  run({ cwd }, "git", "add", "--all")
  run({ cwd }, "git", "commit", "-m", msg)
  run({ cwd }, "push", "--force")
}

const copy = async () => {
  const prev = await readdir(artifacts_dir)
  const prev__artifacts = filter((n) => !n.endsWith(".git"), prev)
  await Promise.all(
    map((path) => rm(path, { recursive: true }), prev__artifacts),
  )
  await cp(dist_dir, artifacts_dir, { recursive: true })
  await writeFile(diff_guarantee, time, { encoding: "utf-8" })
}

const main = async () => {
  chdir(top_level)
  await git_clone()
  run({}, "npm", "run", "build")
  await copy()
  git_commit()
}

main()
