package seo

import (
	"github.com/pc810/threadly/threadly-go/internal/downloader"
)

func ExtractWebsite(url string) (*downloader.Website, error) {

	service := downloader.NewHTMLCollyService()

	return service.ExtractSEO(url)

}
