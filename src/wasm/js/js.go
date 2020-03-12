package js2

import (
	"syscall/js"

	"../utils"
)

var Binding = js.Global().Get("__go-wasm__")

func NewTypedArrayContainer(slice interface{}) js.Value {
	out := make(map[string]interface{})
	wrapped := js.TypedArrayOf(slice)
	yeet := js.Func{}
	release := func(_ js.Value, _ []js.Value) interface{} {
		wrapped.Release()
		yeet.Release()
		return js.Undefined()
	}
	yeet = js.FuncOf(release)
	out["array"] = wrapped
	out["release"] = yeet
	return js.ValueOf(out)
}

func NewValueFunc(fun func([]js.Value) (interface{}, error)) js.Func {
	function := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		defer utils.Recover("-- WASM ERROR --")
		out := make(map[string]interface{})
		value, err := fun(args)

		if err != nil {
			out["type"] = "error"
			out["error"] = err.Error()
		} else {
			out["type"] = "result"
			out["value"] = value
		}

		return js.ValueOf(out)
	})
	return function
}
