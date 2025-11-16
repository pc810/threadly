package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func main() {

	ctx, cancel := context.WithCancel(context.Background())

	wg, seoCtx := start(ctx, 5)
	defer Close(seoCtx)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	<-sigChan
	fmt.Println("Shutdown signal received")
	cancel()
	wg.Wait()

	fmt.Println("All workers stopped gracefully")
}
