package seo

import (
	"time"

	"github.com/pc810/threadly/threadly-go/internal/downloader"
	"github.com/pc810/threadly/threadly-go/logger"
	"go.uber.org/zap"
)

type ExtractSEOEvent struct {
	Id     string
	PostId string
	Url    string
}

type ExtractSEOCompleteEvent struct {
	Id          string
	CompletedAt time.Time
	Website     *downloader.Website
}

func ExtractEvent(event ExtractSEOEvent) *ExtractSEOCompleteEvent {

	defer logger.Log.Sync()

	start := time.Now()

	service := downloader.NewCollyService()
	logger.Log.Info("started", zap.String("eventId", event.Id))

	Website, err := service.ExtractSEO(event.Url)

	if err != nil {
		logger.Log.Error("failed", zap.Error(err), zap.String("eventId", event.Id))
	}

	logger.Log.Info("complete", zap.Duration("duration", time.Since(start)), zap.String("eventId", event.Id))

	return &ExtractSEOCompleteEvent{
		Id:          event.Id,
		Website:     Website,
		CompletedAt: time.Now(),
	}

}
