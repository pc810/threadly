package main

import (
	"github.com/pc810/threadly/threadly-go/downloader"
	"github.com/pc810/threadly/threadly-go/logger"
)

func main() {
	logger.Init()
	defer logger.Log.Sync()

	logger.Log.Info("downloader started")
	//downloader.DownloadUrl("http://127.0.0.1:5500/demo/index.html")
	downloader.ExtractSEO("http://127.0.0.1:5500/demo/index.html")
	// ogimage.OgImage()
}
