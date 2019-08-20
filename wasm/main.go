package main

import (
	"fmt"
	"syscall/js"

	"./game"
	js2 "./js"
)

const (
	buffersize = 1
	concurrency = 10
)

type scalar = game.Scalar


func main() {

	chaosgame := game.New(buffersize, concurrency)
	chaosgame.Start()

	NewVertices := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := args[0].Int()
		err := chaosgame.NewVertices(value)
		return nil, err
	})
	js2.Binding.Set("NewVertices", NewVertices)

	NewRestriction := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := args[0].Int()
		err := chaosgame.NewRestriction(game.Restriction(value))
		return nil, err
	})
	js2.Binding.Set("NewRestriction", NewRestriction)

	NewCompression := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := scalar(args[0].Float())
		err := chaosgame.NewCompression(value)
		return nil, err
	})
	js2.Binding.Set("NewCompression", NewCompression)

	NewDots := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := args[0].Int() - 1
		err := chaosgame.NewDots(value)
		return nil, err
	})
	js2.Binding.Set("NewDots", NewDots)

	NewVertex := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := game.Vertex{
			X: scalar(args[0].Index(0).Float()),
			Y: scalar(args[0].Index(1).Float()),
		}
		assign := args[1].Bool()
		err := chaosgame.NewVertex(game.VertexEvent{
			Vertex: value,
			Assign: assign,
		})
		return nil, err
	})
	js2.Binding.Set("NewVertex", NewVertex)

	RequestDrawingInstructions := js2.NewValueFunc(func(args []js.Value) (interface{}, error) {
		value := game.DrawingOptions{
			Rotations: args[0].Get("rotations").Int(),
			Theta: scalar(args[0].Get("theta").Float()),
			DotTracerSize: scalar(args[0].Get("dotTracerSize").Float()),
			VertexTracerSize: scalar(args[0].Get("vertexTracerSize").Float()),
		}
		out := make(map[string]interface{})
		instructions := chaosgame.NewDrawingInstructions(value)
		out["polygon"] = js2.NewTypedArrayContainer(instructions.Polygon)
		out["dots"] = js2.NewTypedArrayContainer(instructions.Dots)
		out["vertextracers"] = js2.NewTypedArrayContainer(instructions.VertexTracers)
		out["dottracers"] = js2.NewTypedArrayContainer(instructions.DotTracers)
		out["count"] = instructions.Count
		out["centroid"] = func() interface{} {
			centroid := make(map[string]interface{})
			centroid["x"] = instructions.Centroid.X
			centroid["y"] = instructions.Centroid.Y
			return centroid
		}()
		return out, nil
	})
	js2.Binding.Set("RequestDrawingInstructions", RequestDrawingInstructions)

	fmt.Println("- WASM Ready -")

	<-make(chan struct{})
}
