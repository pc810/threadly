package main

import (
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
	PostQueue          = "post.link.queue"
	RoutingKey         = "post.link.created"
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

type ExtractSEOCompleteEvent struct {
	Id          string
	CompletedAt time.Time
	Website     *downloader.Website
}

type SEOExtractWorker struct {
	log     *zap.Logger
	context *SEOWorkerContext
}

type SEOWorkerContext struct {
	msgs <-chan amqp.Delivery
}

func newSeoWorker(workerID int, ctx *SEOWorkerContext) *SEOExtractWorker {
	return &SEOExtractWorker{
		log:     logger.NewWorkerLogger(fmt.Sprintf("seo-worker-%d", workerID)),
		context: ctx,
	}
}

func start() *sync.WaitGroup {
	const workerCount = 5
	var wg sync.WaitGroup
	wg.Add(workerCount)
	ctx := newSeoWorkerContext()
	for i := 0; i < workerCount; i++ {
		go func(workerID int) {
			w := newSeoWorker(workerID, ctx)
			defer wg.Done()
			w.start()
		}(i)
	}
	return &wg
}

func (worker *SEOExtractWorker) start() {
	worker.log.Info("starter worker")
	for d := range worker.context.msgs {
		var event LinkPostCreatedEvent
		if err := json.Unmarshal(d.Body, &event); err != nil {
			worker.log.Error("Failed to unmarshal: %v", zap.Error(err))
			continue
		}
		worker.log.Info("Received event", zap.Any("event", event))
		worker.extractSeoFromEvent(&event)
	}

}

func (worker *SEOExtractWorker) extractSeoFromEvent(event *LinkPostCreatedEvent) {

	worker.log.Info("started", zap.String("eventId", event.Id))

	start := time.Now()

	website, err := seo.ExtractWebsite(event.Link)

	if err != nil {
		worker.log.Error("failed", zap.Error(err), zap.String("eventId", event.Id))
	}

	worker.log.Info("complete", zap.Duration("duration", time.Since(start)), zap.String("eventId", event.Id))

	worker.log.Info("result", zap.Any("website", website))
}

func (worker *SEOExtractWorker) publishCompletedMessage() {

}

func newSeoWorkerContext() *SEOWorkerContext {
	conn, err := amqp.Dial(RabbitURL)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	err = ch.ExchangeDeclare(
		PostEventsExchange, // name
		"direct",           // type
		true,               // durable
		false,              // auto-deleted
		false,              // internal
		false,              // no-wait
		nil,                // arguments
	)
	failOnError(err, "Failed to declare exchange")

	// Declare queue
	q, err := ch.QueueDeclare(
		PostQueue, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	failOnError(err, "Failed to declare queue")

	err = ch.QueueBind(
		q.Name,             // queue name
		RoutingKey,         // routing key
		PostEventsExchange, // exchange
		false,
		nil,
	)
	failOnError(err, "Failed to bind queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register consumer")

	return &SEOWorkerContext{msgs: msgs}
}
