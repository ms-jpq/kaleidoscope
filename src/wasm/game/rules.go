package game

import (
	"errors"

	"../gameengine"
)

const (
	glCanvasSize = 2.0
	glcoord      = gameengine.Cartesian
)

type rules struct {
	vertices    int
	restriction Restriction
	compression Scalar
	extraDots   int
}

func newRules() rules {
	rules := rules{}
	err := rules.setVertices(3)
	if err != nil {
		panic("")
	}
	err = rules.setRestriction(0)
	if err != nil {
		panic("")
	}
	err = rules.setCompression(0.5)
	if err != nil {
		panic("")
	}
	err = rules.setDots(0)
	if err != nil {
		panic("")
	}
	return rules
}

func (r *rules) setVertices(value int) error {
	if value < 3 {
		return errors.New("invaild vertices")
	} else {
		r.vertices = value
		return nil
	}
}
func (r *rules) setRestriction(value Restriction) error {
	if value < 0 || value >= gameengine.RESTRICTION_ERROR {
		return errors.New("invaild restriction")
	} else {
		r.restriction = value
		return nil
	}
}
func (r *rules) setCompression(value Scalar) error {
	if value < 0 || value > 1 {
		return errors.New("invaild compression")
	} else {
		r.compression = value
		return nil
	}
}
func (r *rules) setDots(value int) error {
	if value < 0 {
		return errors.New("invaild dots")
	} else {
		r.extraDots = value
		return nil
	}
}

func (r *rules) newEngine() *engine {
	factory, err := gameengine.NewFactory(glcoord, glCanvasSize, r.vertices)
	if err != nil {
		panic("")
	}
	engine, err := factory.New(r.restriction, r.compression)
	if err != nil {
		panic("")
	}
	return engine
}
