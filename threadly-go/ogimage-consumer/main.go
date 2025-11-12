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
	service := downloader.NewCollyService()
	var results []*downloader.Website

	for i := 0; i < 50; i++ {
		// site, err := service.ExtractSEO("https://leetcode.com/")
		site, err := service.ExtractSEO("http://127.0.0.1:5500/demo/index.html")
		if err != nil {
			logger.Log.Error("extract:seo", zap.Error(err))
			continue
		}
		results = append(results, site)
	}
	service.Wait()
	logger.Log.Info("finished work", zap.Duration("duration", time.Since(start)))
	// logger.Log.Info("results", zap.Any("results", results))

	// ogimage.OgImage()
}
