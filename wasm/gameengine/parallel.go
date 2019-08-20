package gameengine

import (
	"sync"
)

type Type = Tracker

func merge(cs []chan Type) chan Type {
	wg := sync.WaitGroup{}
	out := make(chan Type)
	output := func(ch chan Type) {
		defer wg.Done()
		for item := range ch {
			out <- item
		}
	}
	wg.Add(len(cs))
	for _, c := range cs {
		go output(c)
	}
	go func() {
		wg.Wait()
		close(out)
	}()
	return out
}
