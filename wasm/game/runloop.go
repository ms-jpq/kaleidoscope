package game

import (
	"math/rand"
	"time"

	"../gameengine"
)

type Vertex = gameengine.Vertex
type vertices = gameengine.Vertices
type polygon = gameengine.Polygon
type Scalar = gameengine.Scalar
type tracker = gameengine.Tracker
type Restriction = gameengine.JumpRestriction
type engine = gameengine.Engine

type move struct {
	polygon   polygon
	main      tracker
	auxiliary []tracker
}

type Game struct {
	concurrency   int
	rules         rules
	vertexCh      chan VertexEvent
	movesCh       chan move
	verticesCh    chan int
	restrictionCh chan Restriction
	compressionCh chan Scalar
	dotsCh        chan int
	statusCh      chan error
}

type VertexEvent struct {
	Vertex Vertex
	Assign bool
}

func (game *Game) NewVertices(value int) error {
	game.verticesCh <- value
	return <-game.statusCh
}
func (game *Game) NewRestriction(value Restriction) error {
	game.restrictionCh <- value
	return <-game.statusCh
}
func (game *Game) NewCompression(value Scalar) error {
	game.compressionCh <- value
	return <-game.statusCh
}
func (game *Game) NewDots(value int) error {
	game.dotsCh <- value
	return <-game.statusCh
}
func (game *Game) NewVertex(value VertexEvent) error {
	game.vertexCh <- value
	return <-game.statusCh
}
func (game *Game) requestNextMove() move {
	return <-game.movesCh
}

func New(cacheSize, concurrency int) *Game {

	game := Game{
		rules:         newRules(),
		concurrency:   concurrency,
		movesCh:       make(chan move, cacheSize),
		vertexCh:      make(chan VertexEvent),
		verticesCh:    make(chan int),
		restrictionCh: make(chan Restriction),
		compressionCh: make(chan Scalar),
		dotsCh:        make(chan int),
		statusCh:      make(chan error),
	}

	return &game
}

func (game *Game) nextMove(mov *move) move {
	engine := game.rules.newEngine()
	polygon := engine.Polygon
	main := engine.Next(mov.main)
	aux := engine.NextMany(mov.main, mov.auxiliary, game.rules.extraDots, game.concurrency)
	return move{polygon: polygon, main: main, auxiliary: aux}
}

func (game *Game) purge() {
	for i := 0; i < cap(game.movesCh); i++ {
		<-game.movesCh
	}
}

func (game *Game) Start() {
	next := game.nextMove(&move{})

	go func() {
		for {
			select {
			case vertices := <-game.verticesCh:
				err := game.rules.setVertices(vertices)
				game.purge()
				game.statusCh <- err
			case restriction := <-game.restrictionCh:
				game.statusCh <- game.rules.setRestriction(restriction)
			case compression := <-game.compressionCh:
				game.statusCh <- game.rules.setCompression(compression)
			case dots := <-game.dotsCh:
				game.statusCh <- game.rules.setDots(dots)
			case event := <-game.vertexCh:
				engine := game.rules.newEngine()
				track, err := engine.Begin(event.Vertex)
				if err == nil && event.Assign {
					next = move{polygon: engine.Polygon, main: track, auxiliary: []tracker{}}
					game.purge()
				}
				game.statusCh <- err
			case game.movesCh <- next:
				next = game.nextMove(&next)
			}
		}
	}()

	rand.Seed(time.Now().UnixNano())
}
