package math2

import (
	"math"
)

func Round(float float64) int {
	return int(math.Round(float))
}

func Celi(fst, snd int) int {
	return int(math.Ceil(float64(fst) / float64(snd)))
}

func Floor(fst, snd int) int {
	return int(math.Floor(float64(fst) / float64(snd)))
}

func Min(fst int, rest ...int) int {
	min := fst
	for _, i := range rest {
		if i < min {
			min = i
		}
	}
	return min
}

func Max(fst int, rest ...int) int {
	max := fst
	for _, i := range rest {
		if i > max {
			max = i
		}
	}
	return max
}

func Sin32(n float32) float32 {
	return float32(math.Sin(float64(n)))
}

func Cos32(n float32) float32 {
	return float32(math.Cos(float64(n)))
}

func Min32(fst float32, rest ...float32) float32 {
	min := fst
	for _, i := range rest {
		if i < min {
			min = i
		}
	}
	return min
}

func Max32(fst float32, rest ...float32) float32 {
	max := fst
	for _, i := range rest {
		if i > max {
			max = i
		}
	}
	return max
}

func Pow32(f, power float32) float32 {
	return float32(math.Pow(float64(f), float64(power)))
}

func SqrtF32(f float32) float32 {
	return Pow32(f, 0.5)
}
