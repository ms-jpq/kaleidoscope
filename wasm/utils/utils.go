package utils

import (
	"fmt"
)

func Range(lo, hi int) []int {
	out := make([]int, hi-lo+1)
	for i, _ := range out {
		out[i] = i + lo
	}
	return out
}

func IterateOver(lo, hi int, cb func(int)) {
	for _, i := range Range(lo, hi) {
		cb(i)
	}
}

func Recover(msg string) {
	if r := recover(); r != nil {
		fmt.Println(msg)
		fmt.Println(r)
	}
}

func Meh(...interface{}) {

}
