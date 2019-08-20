package gameengine

import (
	"errors"
	"math/rand"
)

type JumpRestriction int
type JumpFunction func(int, int, int) int

const (
	none JumpRestriction = iota
	force_CW

	noSameDir
	last_noSameDir

	noAdjacent_exclusive
	last_noAdjacent_exclusive

	noAcross
	last_noAcross

	noAdjacent_inclusive
	last_noAdjacent_inclusive

	RESTRICTION_ERROR
)

func newJumpFunction(restriction JumpRestriction) (JumpFunction, error) {
	switch restriction {
	case none:
		return noRestriction_CF, nil
	case force_CW:
		return force_CW_CF, nil

		// NO_SAME
	case noSameDir:
		return noSameDir_CF, nil
	case last_noSameDir:
		return last_noSameDir_CF, nil

		// NO_ACROSS
	case noAcross:
		return noAcross_CF, nil
	case last_noAcross:
		return last_noAcross_CF, nil

		// NO_ADJACENT_INCLUSIVE
	case noAdjacent_inclusive:
		return noAdjacent_inclusive_CF, nil
	case last_noAdjacent_inclusive:
		return last_noAdjacent_inclusive_CF, nil

		// NO_ADJACENT_EXCLUSIVE
	case noAdjacent_exclusive:
		return noAdjacent_exclusive_CF, nil
	case last_noAdjacent_exclusive:
		return last_noAdjacent_exclusive_CF, nil

	default:
		return nil, errors.New("invaild jumpfunction")
	}
}

func warpAround(arrayCount, i int) int {
	return (i%arrayCount + arrayCount) % arrayCount
}

func noRestriction_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	return new
}

/*
 * Force_Dir
 */

func force_CW_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	last_CCW := warpAround(vertexCount, last-1)
	for new == last || new == last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

/*
 * No_Same
 */

func noSameDir_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	for new == last {
		new = rand.Intn(vertexCount)
	}
	return new
}

func last_noSameDir_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	for new == last_last {
		new = rand.Intn(vertexCount)
	}
	return new
}

/*
 * No_Adjacent_Inclusive
 */

func noAdjacent_inclusive_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	last_CW := warpAround(vertexCount, last+1)
	last_CCW := warpAround(vertexCount, last-1)
	for new == last || new == last_CW || new == last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

func last_noAdjacent_inclusive_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	last_last_CW := warpAround(vertexCount, last_last+1)
	last_last_CCW := warpAround(vertexCount, last_last-1)
	for new == last_last || new == last_last_CW || new == last_last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

/*
 * No_Adjacent_Exclusive
 */

func noAdjacent_exclusive_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	last_CW := warpAround(vertexCount, last+1)
	last_CCW := warpAround(vertexCount, last-1)
	for new == last_CW || new == last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

func last_noAdjacent_exclusive_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	last_last_CW := warpAround(vertexCount, last_last+1)
	last_last_CCW := warpAround(vertexCount, last_last-1)
	for new == last_last_CW || new == last_last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

/*
 * No_Across
 */

func noAcross_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	acrossDist := vertexCount / 2
	last_CW := warpAround(vertexCount, last+acrossDist)
	last_CCW := warpAround(vertexCount, last-acrossDist)
	for new == last_CW || new == last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}

func last_noAcross_CF(vertexCount, last, last_last int) int {
	new := rand.Intn(vertexCount)
	acrossDist := vertexCount / 2
	last_last_CW := warpAround(vertexCount, last_last+acrossDist)
	last_last_CCW := warpAround(vertexCount, last_last-acrossDist)
	for new == last_last_CW || new == last_last_CCW {
		new = rand.Intn(vertexCount)
	}
	return new
}
