package storage

import (
	"log"
	"os"
	"path/filepath"
)

type StorageService interface {
	Save(filename string, data []byte, content_type string) error
	Delete(filename string) error
	Get(filename string) ([]byte, error)
	GetBasePath() string
	GetProvider() string
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func NewService(serviceType string, bucket_name string) StorageService {
	switch serviceType {
	case "local":
		tempDir := filepath.Join(os.TempDir(), bucket_name)
		err := os.MkdirAll(tempDir, 0755)
		failOnError(err, "unable to make temp folder")

		return NewLocalStorageService(tempDir)
	case "s3":
		return NewS3StorageService(bucket_name)
	default:
		return nil
	}
}
