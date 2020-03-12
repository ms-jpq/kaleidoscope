#!/usr/bin/env ts-node
import { cp, readdir, rm } from "nda/dist/node/fs"
import { filter, map } from "nda/dist/isomorphic/list"
import { run } from "nda/dist/node/sub_process"

const dist_dir = "./dist"
const artifacts_dir = "./artifacts"
const sub_path = "/kaleidoscope-page"

const main = async () => {
  await rm(dist_dir)
  const { stdout, stderr } = await run(
    "parcel",
    "--public-url",
    sub_path,
    "src/index.html",
  )
  console.error(stderr)
  console.log(stdout)
  const { stdout: goout, stderr: goerr } = await run("./build.sh")
  console.error(goerr)
  console.log(goout)
  const prev = await readdir(1, artifacts_dir)
  const prev__artifacts = filter((n) => !n.startsWith(".git"), [
    ...prev.dirs,
    ...prev.files,
  ])
  await Promise.all(map(rm, prev__artifacts))
  await cp(dist_dir, artifacts_dir)

  const { stdout: gout, stderr: gerr } = await run("./git.sh")
  console.error(gerr)
  console.log(gout)
}

main()
