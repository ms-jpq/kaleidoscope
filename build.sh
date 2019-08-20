#!/bin/sh

cat $(go env GOROOT)/misc/wasm/wasm_exec.js > ./page/wasm_go.js
GOOS=js GOARCH=wasm go build -o ./out/main.wasm ./wasm/main.go
