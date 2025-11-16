package storage

import (
	"bytes"
	"context"
	"io"
	"log"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Config struct {
	endpoint        string
	accessKeyID     string
	secretAccessKey string
	useSSL          bool
}

const (
	S3SeoImageBucket = "seo"
)

type S3StorageService struct {
	client     *minio.Client
	bucketName string
}

var config = S3Config{
	endpoint:        "localhost:9000",
	accessKeyID:     "minioadmin",
	secretAccessKey: "minioadmin",
	useSSL:          false,
}

func NewS3StorageService(bucketName string) *S3StorageService {

	client, err := minio.New(config.endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.accessKeyID, config.secretAccessKey, ""),
		Secure: config.useSSL,
	})

	failOnError(err, "unable to create s3 client")

	service := S3StorageService{client: client, bucketName: bucketName}
	service.init(bucketName)

	return &service
}

func (s *S3StorageService) init(bucketName string) {
	s.createIfNotExists(bucketName)
}

func (s *S3StorageService) createIfNotExists(bucketName string) {
	err := s.client.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := s.client.BucketExists(context.Background(), bucketName)
		if errBucketExists == nil && exists {
			log.Println("Bucket already exists:", bucketName)
		} else {
			log.Fatalln(err)
		}
	} else {
		log.Println("Bucket created:", bucketName)
	}
}

func (s *S3StorageService) Save(filename string, data []byte, content_type string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := s.client.PutObject(
		ctx,
		s.bucketName,
		filename,
		bytes.NewReader(data),
		int64(len(data)),
		minio.PutObjectOptions{ContentType: content_type},
	)

	return err
}

func (s *S3StorageService) Delete(filename string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := s.client.RemoveObject(
		ctx,
		s.bucketName,
		filename,
		minio.RemoveObjectOptions{},
	)
	return err
}

func (s *S3StorageService) Get(filename string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	obj, err := s.client.GetObject(ctx, s.bucketName, filename, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	defer obj.Close()

	return io.ReadAll(obj)
}

func (s *S3StorageService) GetProvider() string {
	return "s3"
}

func (s *S3StorageService) GetBasePath() string {
	return s.bucketName
}
