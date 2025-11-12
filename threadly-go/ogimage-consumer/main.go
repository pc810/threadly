package main

import (
	"time"

	"github.com/pc810/threadly/threadly-go/downloader"
	"github.com/pc810/threadly/threadly-go/logger"
	"go.uber.org/zap"
)

func main() {
	logger.Init()
	defer logger.Log.Sync()

	logger.Log.Info("downloader started")
	start := time.Now()

	// downloader.DownloadUrl("http://127.0.0.1:5500/demo/index.html")

	downloader.ExtractSEO("http://127.0.0.1:5500/demo/index.html")
	downloader.ExtractSEO("http://127.0.0.1:5500/demo/public/pietro-de-grandi-T7K4aEPoGGk-unsplash.jpg")

	logger.Log.Info("finished work", zap.Duration("duration", time.Since(start)))

	// ogimage.OgImage()
}
