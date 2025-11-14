package downloader

import (
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/pc810/threadly/threadly-go/internal/logger"
	"go.uber.org/zap"
)

const maxBodySize = 0.5 * 1024 * 1024

type DownloadResponse struct {
	Url           string
	StatusCode    int
	ContentLength int64
	Body          []byte
	Duration      time.Duration
}

func DownloadUrl(url string) (*DownloadResponse, error) {

	reqId := uuid.New().String()

	start := time.Now()

	logger.Log.Info("download:start", zap.String("request_id", reqId), zap.String("url", url))

	client := &http.Client{Timeout: 10 * time.Second}

	resp, err := client.Get(url)

	if err != nil {
		logger.Log.Error("HTTP GET failed", zap.String("request_id", reqId), zap.Error(err))
		return nil, err
	}

	defer resp.Body.Close()

	limitReader := io.LimitReader(resp.Body, maxBodySize)

	body, err := io.ReadAll(limitReader)

	if err != nil {
		logger.Log.Error("Failed to read response body", zap.String("request_id", reqId), zap.Error(err))
		return nil, err
	}

	result := DownloadResponse{
		Url:           url,
		StatusCode:    resp.StatusCode,
		ContentLength: resp.ContentLength,
		Body:          body,
		Duration:      time.Since(start),
	}

	logger.Log.Info("download:finish",
		zap.String("request_id", reqId),
		zap.String("url", result.Url),
		zap.Int("status_code", result.StatusCode),
		zap.Int64("content_length", result.ContentLength),
		zap.Duration("duration", result.Duration),
	)

	return &result, nil

}
