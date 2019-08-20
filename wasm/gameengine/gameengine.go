package gameengine

import (
	"errors"
	"math/rand"

	"../vectors"
)

type Vertex = vectors.Vec2
type Scalar = vectors.Scalar
type Vertices = []Vertex

type EngineFactory struct {
	polygon Polygon
}

type Engine struct {
	Polygon      Polygon
	jumpFunction func(int, int, int) int
	compression  Scalar
}

type Tracker struct {
	Pos     Vertex
	Dir     int
	PrevDir int
}

func NewFactory(coordinate CoordinateSystem, diameter Scalar, vertices int) (EngineFactory, error) {
	polygon, err := newPolygon(vertices, coordinate, diameter)
	if err != nil {
		return EngineFactory{}, err
	} else {
		return EngineFactory{polygon}, nil
	}
}

func (factory *EngineFactory) New(restriction JumpRestriction, compression Scalar) (*Engine, error) {
	jumpFunction, err := newJumpFunction(restriction)
	if err != nil {
		return nil, err
	}
	if compression < 0 || compression > 1 {
		return nil, errors.New("invaild compression ratio")
	}
	engine := Engine{Polygon: factory.polygon, jumpFunction: jumpFunction, compression: compression}
	return &engine, nil
}

func (engine *Engine) Begin(pos Vertex) (Tracker, error) {
	if !includes(engine.Polygon.Vertices, pos) {
		return Tracker{}, errors.New("invaild position")
	} else {
		return Tracker{
			Pos:     pos,
			Dir:     rand.Intn(engine.Polygon.Count),
			PrevDir: rand.Intn(engine.Polygon.Count),
		}, nil
	}
}

func advance(origin, dest, compression Scalar) Scalar {
	return (origin-dest)*compression + dest
}

func (engine *Engine) Next(tracker Tracker) Tracker {
	dir := engine.jumpFunction(engine.Polygon.Count, tracker.Dir, tracker.PrevDir)
	x := advance(tracker.Pos.X, engine.Polygon.Vertices[dir].X, engine.compression)
	y := advance(tracker.Pos.Y, engine.Polygon.Vertices[dir].Y, engine.compression)
	return Tracker{Pos: Vertex{X: x, Y: y}, Dir: dir, PrevDir: tracker.Dir}
}

func (engine *Engine) nextMany(ch chan Tracker) chan Tracker {
	out := make(chan Tracker)
	go func() {
		defer close(out)
		for tracker := range ch {
			out <- engine.Next(tracker)
		}
	}()
	return out
}

func gen(primiary Tracker, trackers []Tracker, count int) chan Tracker {
	ch := make(chan Tracker)
	n := len(trackers)
	go func() {
		defer close(ch)
		for i := 0; i < count; i++ {
			if i < n {
				ch <- trackers[i]
			} else {
				ch <- primiary
			}
		}
	}()
	return ch
}

func (engine *Engine) NextMany(primiary Tracker, trackers []Tracker, count, concurrency int) []Tracker {
	ch := gen(primiary, trackers, count)
	cs := make([]chan Tracker, concurrency)
	out := make([]Tracker, count)
	for i, _ := range cs {
		cs[i] = engine.nextMany(ch)
	}
	res := merge(cs)
	for i, _ := range out {
		out[i] = <-res
	}
	return out
}
