#!/bin/bash

cd "$(dirname "$0")" || exit

mkdir -p ./dist
cat "$(go env GOROOT)/misc/wasm/wasm_exec.js" > ./src/wasm_go.js
GOOS=js GOARCH=wasm go build -o ./dist/main.wasm ./src/wasm/main.go

echo "built wasm"
