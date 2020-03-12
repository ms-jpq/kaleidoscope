#!/bin/bash

cat "$(go env GOROOT)/misc/wasm/wasm_exec.js" > ./src/wasm_go.js
GOOS=js GOARCH=wasm go build -o ./dist/main.wasm ./src/wasm/main.go
