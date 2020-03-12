package gameengine

import (
	"errors"
	"math"

	math2 "../math"
)

const (
	π = Scalar(math.Pi)
	τ = Scalar(π * 2)
)

type Polygon struct {
	Vertices Vertices
	Centroid Vertex
	Count    int
}

type CoordinateSystem int

const (
	Cartesian CoordinateSystem = iota
	Screen
)

func centroid(vertices Vertices) Vertex {
	centroid := Vertex{}
	for _, v := range vertices {
		centroid = centroid.PlusV(v)
	}
	return centroid.DivideBy(Scalar(len(vertices)))
}

func includes(vertices Vertices, vertex Vertex) bool {
	ans, px, py, j := false, vertex.X, vertex.Y, len(vertices)-1
	for i := range vertices {
		if ((vertices[i].Y >= py) != (vertices[j].Y >= py)) && (px <= (vertices[j].X-vertices[i].X)*(py-vertices[i].Y)/(vertices[j].Y-vertices[i].Y)+vertices[i].X) {
			ans = !ans
		}
		j = i
	}
	return ans
}

func newPolygon(vertices int, coordinate CoordinateSystem, diameter Scalar) (Polygon, error) {
	if vertices < 1 || diameter <= 0 {
		return Polygon{}, errors.New("invalid geometry")
	}

	radius := diameter / 2
	rawV := rawVertices(radius, vertices)
	offsetV := offsetVertices(rawV)
	scale := scale(offsetV, radius)
	cartesianV := make(Vertices, vertices)
	for i, v := range offsetV {
		cartesianV[i] = Vertex{X: v.X * scale, Y: v.Y * scale}
	}
	screenV := make(Vertices, vertices)
	for i, v := range cartesianV {
		screenV[i] = Vertex{X: radius + v.X, Y: radius - v.Y}
	}

	switch coordinate {
	case Cartesian:
		return Polygon{Vertices: cartesianV, Centroid: centroid(cartesianV), Count: vertices}, nil
	case Screen:
		return Polygon{Vertices: screenV, Centroid: centroid(screenV), Count: vertices}, nil
	default:
		return Polygon{}, errors.New("invalid coordinate")
	}
}

func startingθ(vertexCount int) Scalar {
	baseθ := π / 2
	if vertexCount%2 == 0 {
		return baseθ + (τ / Scalar(vertexCount) / 2)
	} else {
		return baseθ
	}
}

func rawVertices(radius Scalar, vertexCount int) Vertices {
	θ := startingθ(vertexCount)
	θIncrement := τ / Scalar(vertexCount)
	vertices := make(Vertices, vertexCount)
	for i := range vertices {
		x := math2.Cos32(θ-Scalar(i+1)*θIncrement) * radius
		y := math2.Sin32(θ-Scalar(i+1)*θIncrement) * radius
		vertices[i] = Vertex{X: x, Y: y}
	}
	return vertices
}

func offsetVertices(rawVertices Vertices) Vertices {
	minY := Scalar(math.MaxFloat32)
	for _, v := range rawVertices {
		minY = math2.Min32(minY, v.Y)
	}
	maxY := Scalar(-math.MaxFloat32)
	for _, v := range rawVertices {
		maxY = math2.Max32(maxY, v.Y)
	}
	offsetY := 0 - (minY+maxY)/2
	offsetVertices := make(Vertices, len(rawVertices))
	for i, v := range rawVertices {
		offsetVertices[i] = Vertex{X: v.X, Y: v.Y + offsetY}
	}
	return offsetVertices
}

func scale(offsetVertices Vertices, radius Scalar) Scalar {
	scale := Scalar(math.MaxFloat32)
	for _, v := range offsetVertices {
		scaleX, scaleY := scale, scale
		if v.X > 0 {
			scaleX = radius / v.X
		}
		if v.Y > 0 {
			scaleY = radius / v.Y
		}
		scale = math2.Min32(scaleX, scaleY, scale)
	}
	return scale
}
