package main

import (
	"os"
	"os/signal"
	"syscall"
)

func main() {

	wg := start()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	<-sigChan

	wg.Wait()
}
