package storage

import (
	"log"
	"os"
	"path/filepath"
)

type StorageService interface {
	Save(filename string, data []byte) error
	Delete(filename string) error
	GetProvider() string
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func NewService(serviceType string) StorageService {
	switch serviceType {
	case "local":
		tempDir := filepath.Join(os.TempDir(), "threadly-temp")
		err := os.MkdirAll(tempDir, 0755)
		failOnError(err, "unable to make temp folder")

		return NewLocalStorageService(tempDir)
	// case "s3":
	// 	return NewS3FileService(myS3Client, "my-bucket")
	default:
		return nil
	}
}
