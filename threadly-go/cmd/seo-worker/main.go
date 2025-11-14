package main

import (
	"github.com/pc810/threadly/threadly-go/internal/seo"
	"github.com/pc810/threadly/threadly-go/logger"
	"go.uber.org/zap"
)

func main() {
	logger.Init("seo-worker")

	event := seo.ExtractSEOEvent{
		Id:     "123",
		PostId: "123",
		Url:    "http://127.0.0.1:5500/demo/index.html",
	}

	result := seo.ExtractEvent(event)

	logger.Log.Info("result", zap.Any("event", result))

}
