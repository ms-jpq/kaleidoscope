package game

import (
	"math"
)

const (
	π = Scalar(math.Pi)
	τ = Scalar(π * 2)
)

type DrawingOptions struct {
	Rotations        int
	Theta            Scalar
	DotTracerSize    Scalar
	VertexTracerSize Scalar
}

type DrawingInstructions struct {
	Polygon       []Scalar
	Dots          []Scalar
	VertexTracers []Scalar
	DotTracers    []Scalar
	Centroid      Vertex
	Count         int
}

func (game *Game) NewDrawingInstructions(options DrawingOptions) DrawingInstructions {
	move := game.requestNextMove()
	return DrawingInstructions{
		Polygon:       polygonDrawingInstructions(&move.polygon),
		Dots:          move.dotsDrawingInstructions(),
		VertexTracers: move.vertexTracerDrawingInstructions(options.Theta, options.VertexTracerSize),
		DotTracers:    move.dotTracerDrawingInstructions(options.Rotations, options.DotTracerSize),
		Centroid:      move.polygon.Centroid,
		Count:         move.polygon.Count,
	}
}

func polygonDrawingInstructions(polygon *polygon) []Scalar {
	dest := make([]Scalar, polygon.Count*2)
	for i, vertex := range polygon.Vertices {
		j := (i * 2)
		dest[j+0] = vertex.X
		dest[j+1] = vertex.Y
	}
	return dest
}

func (move *move) dotsDrawingInstructions() []Scalar {
	dest := make([]Scalar, (1+len(move.auxiliary))*3)
	dest[0] = move.main.Pos.X
	dest[1] = move.main.Pos.Y
	dest[2] = Scalar(move.main.Dir)
	for i, t := range move.auxiliary {
		j := (i + 1) * 3
		dest[j+0] = t.Pos.X
		dest[j+1] = t.Pos.Y
		dest[j+2] = Scalar(t.Dir)
	}
	return dest
}

func (move *move) vertexTracerDrawingInstructions(θ, size Scalar) []Scalar {
	out := make([]Scalar, 6)
	origin := move.polygon.Vertices[move.main.Dir]
	dest := move.polygon.Centroid
	cwArm := origin.MinusV(origin.MinusV(dest).Rotated(-θ).Normalized().Times(size))
	ccwArm := origin.MinusV(origin.MinusV(dest).Rotated(+θ).Normalized().Times(size))
	out[0] = origin.X
	out[1] = origin.Y
	out[2] = cwArm.X
	out[3] = cwArm.Y
	out[4] = ccwArm.X
	out[5] = ccwArm.Y
	return out
}

func (move *move) dotTracerDrawingInstructions(rotations int, size Scalar) []Scalar {
	dest := make([]Scalar, rotations*2)
	vecRotationθ := τ / Scalar(rotations)
	initVec := Vertex{X: size, Y: size}
	main := move.main.Pos
	for i := 0; i < rotations; i++ {
		j := i * 2
		rotated := main.PlusV(initVec.Rotated(Scalar(i) * vecRotationθ))
		dest[j+0] = rotated.X
		dest[j+1] = rotated.Y
	}
	return dest
}
