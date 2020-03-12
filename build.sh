#!/bin/sh

cat "$(go env GOROOT)/misc/wasm/wasm_exec.js" > ./src/wasm_go.js
GOOS=js GOARCH=wasm go build -o ./src/main.wasm ./src/wasm/main.go
