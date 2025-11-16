package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"sort"
	"sync"
	"time"

	"github.com/pc810/threadly/threadly-go/internal/downloader"
	"github.com/pc810/threadly/threadly-go/internal/logger"
	"github.com/pc810/threadly/threadly-go/internal/storage"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

const (
	RabbitURL                  = "amqp://guest:guest@localhost:5672/"
	PostEventsExchange         = "post.events.exchange"
	CreatePostQueue            = "post.link.created.queue"
	CreatedRoutingKey          = "post.link.created"
	CompletePostQueue          = "post.link.complete.queue"
	CompleteRoutingKey         = "post.link.complete"
	CompleteMediaDownloadQueue = "media.download.complete.queue"
	CompleteMediaRoutingKey    = "media.download.complete"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

type ImageWorkerContext struct {
	seoMsgs <-chan amqp.Delivery
	ch      *amqp.Channel
	conn    *amqp.Connection
}

type ImageWorker struct {
	log     *zap.Logger
	context *ImageWorkerContext
}

type LinkPostCompletedEvent struct {
	Id          string
	PostId      string
	CompletedAt time.Time
	Website     *downloader.Website
}

type ImageDownloadedEvent struct {
	Id      string                  `json:"id"`
	PostId  string                  `json:"postId"`
	File    *downloader.ImageResult `json:"file"`
	Storage string                  `json:"storage"`
}

func start(ctx context.Context, workerCount int) (*sync.WaitGroup, *ImageWorkerContext) {

	var wg sync.WaitGroup
	wg.Add(workerCount)
	imageContext := newImageWorkerContext()

	for i := 0; i < workerCount; i++ {
		go func(workerID int) {
			defer wg.Done()
			w := newImageWorker(workerID, imageContext)
			w.start(ctx)
		}(i)
	}

	return &wg, imageContext
}

func newImageWorkerContext() *ImageWorkerContext {
	conn, err := amqp.Dial(RabbitURL)
	failOnError(err, "Failed to connect to RabbitMQ")

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")

	err = ch.ExchangeDeclare(PostEventsExchange, "direct", true, false, false, false, nil)
	failOnError(err, "Failed to declare exchange")

	completeQ, err := ch.QueueDeclare(CompletePostQueue, true, false, false, false, nil)
	failOnError(err, "Failed to declare complete queue")
	err = ch.QueueBind(completeQ.Name, CompleteRoutingKey, PostEventsExchange, false, nil)
	failOnError(err, "Failed to bind complete queue")

	completeMediaQ, err := ch.QueueDeclare(CompleteMediaDownloadQueue, true, false, false, false, nil)
	failOnError(err, "Failed to declare complete queue")
	err = ch.QueueBind(completeMediaQ.Name, CompleteMediaRoutingKey, PostEventsExchange, false, nil)
	failOnError(err, "Failed to bind complete queue")

	msgs, err := ch.Consume(completeQ.Name, "", false, false, false, false, nil)
	failOnError(err, "Failed to register consumer")

	return &ImageWorkerContext{
		seoMsgs: msgs,
		ch:      ch,
		conn:    conn,
	}
}

func newImageWorker(workerID int, imageWorkerContext *ImageWorkerContext) *ImageWorker {
	log := logger.NewWorkerLogger(fmt.Sprintf("image-worker-%d", workerID))

	return &ImageWorker{
		log:     log,
		context: imageWorkerContext,
	}
}

func (w *ImageWorker) start(ctx context.Context) {

	w.log.Info("started worker")

	for {
		select {
		case <-ctx.Done():
			w.log.Info("Worker stopping")
			return
		case d, ok := <-w.context.seoMsgs:
			if !ok {
				w.log.Info("Channel closed, stopping worker")
				return
			}

			var event LinkPostCompletedEvent
			if err := json.Unmarshal(d.Body, &event); err != nil {
				w.log.Error("Failed to unmarshal", zap.Error(err))
				continue
			}

			w.log.Info("Received event", zap.Any("event", event))
			w.downloadImages(&event)

			if err := d.Ack(false); err != nil {
				w.log.Error("Failed to ack message", zap.Error(err))
			}
		}
	}
}

func Close(ctx *ImageWorkerContext) {
	if err := ctx.ch.Close(); err != nil {
		fmt.Println("Error closing channel:", err)
	}
	if err := ctx.conn.Close(); err != nil {
		fmt.Println("Error closing connection:", err)
	}
}

func (w *ImageWorker) downloadImages(event *LinkPostCompletedEvent) {
	if event.Website == nil {
		w.log.Warn("No website found", zap.String("eventId", event.Id))
		return
	}

	if len(event.Website.SEO.Images) == 0 {
		w.log.Warn("No SEO images found", zap.String("eventId", event.Id))
		return
	}

	storageService := storage.NewService("local")

	allWebsiteImageEvents := make([]*ImageDownloadedEvent, 0)

	collyService := downloader.NewImageCollyService(event.Id, storageService,
		func(result downloader.ImageResult) {
			if result.Err != nil {
				w.log.Error("Failed to save image", zap.String("url", result.URL), zap.Error(result.Err))
			} else {
				event := &ImageDownloadedEvent{
					Id:      event.Id,
					PostId:  event.PostId,
					File:    &result,
					Storage: storageService.GetProvider(),
				}
				allWebsiteImageEvents = append(allWebsiteImageEvents, event)
				// w.publishDownloadedImageEvent(event)
			}
		},
	)

	hasMeta := false

	for _, image := range event.Website.SEO.Images {
		if image.Name == "meta" {
			hasMeta = true
			break
		}
	}

	if hasMeta {
		w.log.Info("extracting meta")
		for _, image := range event.Website.SEO.Images {
			if image.Name == "meta" {
				collyService.ExtractImage(image.Src)
				break
			}
		}

	} else {
		w.log.Info("extracting all images")
		for _, image := range event.Website.SEO.Images {
			collyService.ExtractImage(image.Src)
		}
	}

	collyService.Wait()

	// w.log.Info("Images", zap.Any("images", allWebsiteImageEvents))

	if hasMeta {
		w.publishDownloadedImageEvent(allWebsiteImageEvents[0])
	} else {
		sort.Slice(allWebsiteImageEvents, func(i, j int) bool {
			di := ratioDiff(allWebsiteImageEvents[i].File.Dimension.Width, allWebsiteImageEvents[i].File.Dimension.Height)
			dj := ratioDiff(allWebsiteImageEvents[j].File.Dimension.Width, allWebsiteImageEvents[j].File.Dimension.Height)

			return di < dj
		})

		bestImage := allWebsiteImageEvents[0]
		w.publishDownloadedImageEvent(bestImage)

		for i, image := range allWebsiteImageEvents {
			if i != 0 {
				storageService.Delete(image.File.Filename)
			}
		}

	}
}

func (w *ImageWorker) publishDownloadedImageEvent(event *ImageDownloadedEvent) {
	body, err := json.Marshal(event)

	if err != nil {
		w.log.Error("Failed to marshal event", zap.Error(err))
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	done := make(chan error, 1)

	go func() {
		done <- w.context.ch.Publish(
			PostEventsExchange,
			CompleteMediaRoutingKey,
			false,
			false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        body,
			},
		)
	}()

	select {
	case err := <-done:
		if err != nil {
			w.log.Error("Failed to publish event", zap.Error(err))
		} else {
			w.log.Info("Published event", zap.Any("event", event))
		}

	case <-ctx.Done():
		w.log.Error("Timeout publishing event", zap.String("eventId", event.Id))

	}
}

func ratioDiff(width, height int) float64 {
	target := 16.0 / 9.0
	if height == 0 {
		return 9999
	}
	r := float64(width) / float64(height)
	return math.Abs(r - target)
}
