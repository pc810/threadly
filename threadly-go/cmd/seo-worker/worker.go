package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/pc810/threadly/threadly-go/internal/downloader"
	"github.com/pc810/threadly/threadly-go/internal/logger"
	"github.com/pc810/threadly/threadly-go/internal/seo"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

const (
	RabbitURL          = "amqp://guest:guest@localhost:5672/"
	PostEventsExchange = "post.events.exchange"
	CreatePostQueue    = "post.link.created.queue"
	CreatedRoutingKey  = "post.link.created"
	CompletePostQueue  = "post.link.complete.queue"
	CompleteRoutingKey = "post.link.complete"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

type LinkPostCreatedEvent struct {
	Id     string `json:"id"`
	PostId string `json:"postId"`
	Link   string `json:"link"`
}

type LinkPostCompletedEvent struct {
	Id          string
	PostId      string
	CompletedAt time.Time
	Website     *downloader.Website
}

type SEOExtractWorker struct {
	log     *zap.Logger
	context *SEOWorkerContext
}

type SEOWorkerContext struct {
	linkPostCreatedMsgs <-chan amqp.Delivery
	ch                  *amqp.Channel
	conn                *amqp.Connection
}

func newSeoWorker(workerID int, ctx *SEOWorkerContext) *SEOExtractWorker {
	return &SEOExtractWorker{
		log:     logger.NewWorkerLogger(fmt.Sprintf("seo-worker-%d", workerID)),
		context: ctx,
	}
}

func start(ctx context.Context, workerCount int) (*sync.WaitGroup, *SEOWorkerContext) {
	logger.Init()
	var wg sync.WaitGroup
	wg.Add(workerCount)

	seoCtx := newSeoWorkerContext()

	for i := 0; i < workerCount; i++ {
		go func(workerID int) {
			defer wg.Done()
			w := newSeoWorker(workerID, seoCtx)
			w.start(ctx)
		}(i)
	}

	return &wg, seoCtx
}

func (w *SEOExtractWorker) start(ctx context.Context) {
	w.log.Info("started worker")

	for {
		select {
		case <-ctx.Done():
			w.log.Info("Worker stopping")
			return
		case d, ok := <-w.context.linkPostCreatedMsgs:
			if !ok {
				w.log.Info("Channel closed, stopping worker")
				return
			}

			var event LinkPostCreatedEvent
			if err := json.Unmarshal(d.Body, &event); err != nil {
				w.log.Error("Failed to unmarshal", zap.Error(err))
				continue
			}

			w.log.Info("Received event", zap.Any("event", event))
			w.extractSeoFromEvent(&event)

			if err := d.Ack(false); err != nil {
				w.log.Error("Failed to ack message", zap.Error(err))
			}
		}
	}
}

func Close(ctx *SEOWorkerContext) {
	if err := ctx.ch.Close(); err != nil {
		fmt.Println("Error closing channel:", err)
	}
	if err := ctx.conn.Close(); err != nil {
		fmt.Println("Error closing connection:", err)
	}
}

func (w *SEOExtractWorker) extractSeoFromEvent(event *LinkPostCreatedEvent) {

	w.log.Info("started", zap.String("eventId", event.Id))

	start := time.Now()

	website, err := seo.ExtractWebsite(event.Link)

	if err != nil {
		w.log.Error("failed", zap.Error(err), zap.String("eventId", event.Id))
	}

	w.log.Info("complete", zap.Duration("duration", time.Since(start)), zap.String("eventId", event.Id))
	// w.log.Info("result", zap.Any("website", website))

	w.publishCompleteEvent(&LinkPostCompletedEvent{
		Id:          event.Id,
		PostId:      event.PostId,
		CompletedAt: time.Now(),
		Website:     website,
	})
}

func (w *SEOExtractWorker) publishCompleteEvent(event *LinkPostCompletedEvent) {
	body, err := json.Marshal(event)
	if err != nil {
		w.log.Error("Failed to marshal complete event", zap.Error(err))
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	done := make(chan error, 1)

	go func() {
		done <- w.context.ch.Publish(
			PostEventsExchange,
			CompleteRoutingKey,
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
			w.log.Error("Failed to publish complete event", zap.Error(err))
		} else {
			w.log.Info("Published complete event", zap.Any("event", event))
		}
	case <-ctx.Done():
		w.log.Error("Timeout publishing complete event", zap.String("eventId", event.Id))
	}

}

func newSeoWorkerContext() *SEOWorkerContext {
	conn, err := amqp.Dial(RabbitURL)
	failOnError(err, "Failed to connect to RabbitMQ")

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")

	err = ch.ExchangeDeclare(PostEventsExchange, "direct", true, false, false, false, nil)
	failOnError(err, "Failed to declare exchange")

	createdQ, err := ch.QueueDeclare(CreatePostQueue, true, false, false, false, nil)
	failOnError(err, "Failed to declare created queue")
	err = ch.QueueBind(createdQ.Name, CreatedRoutingKey, PostEventsExchange, false, nil)
	failOnError(err, "Failed to bind created queue")

	completeQ, err := ch.QueueDeclare(CompletePostQueue, true, false, false, false, nil)
	failOnError(err, "Failed to declare complete queue")
	err = ch.QueueBind(completeQ.Name, CompleteRoutingKey, PostEventsExchange, false, nil)
	failOnError(err, "Failed to bind complete queue")

	msgs, err := ch.Consume(createdQ.Name, "", false, false, false, false, nil)
	failOnError(err, "Failed to register consumer")

	return &SEOWorkerContext{
		linkPostCreatedMsgs: msgs,
		ch:                  ch,
		conn:                conn,
	}
}
