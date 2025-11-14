package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/pc810/threadly/threadly-go/internal/downloader"
	"github.com/pc810/threadly/threadly-go/internal/logger"
	"github.com/pc810/threadly/threadly-go/internal/seo"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.uber.org/zap"
)

type LinkPostCreatedEvent struct {
	Id     string `json:"id"`
	PostId string `json:"postId"`
	Link   string `json:"link"`
}

const (
	RabbitURL          = "amqp://guest:guest@localhost:5672/"
	PostEventsExchange = "post.events.exchange"
	PostQueue          = "post.link.queue"
	RoutingKey         = "post.link.created"
)

type ExtractSEOCompleteEvent struct {
	Id          string
	CompletedAt time.Time
	Website     *downloader.Website
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {

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

	const workerCount = 5
	var wg sync.WaitGroup
	wg.Add(workerCount)
	logger.Init("seo-worker")
	for i := 0; i < workerCount; i++ {
		go func(workerID int) {
			workerLogger := logger.NewWorkerLogger(fmt.Sprintf("seo-worker-%d", workerID))
			defer wg.Done()
			for d := range msgs {
				var event LinkPostCreatedEvent
				if err := json.Unmarshal(d.Body, &event); err != nil {
					workerLogger.Error("Failed to unmarshal: %v", zap.Error(err))
					continue
				}
				workerLogger.Info("Received event", zap.Any("event", event))
				extractSeoFromEvent(&event, workerLogger)
			}
		}(i)
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	<-sigChan
}

func extractSeoFromEvent(event *LinkPostCreatedEvent, log *zap.Logger) {

	// event := LinkPostCreatedEvent{
	// 	Id:     "123",
	// 	PostId: "123",
	// 	Link:   "http://127.0.0.1:5500/demo/index.html",
	// }

	log.Info("started", zap.String("eventId", event.Id))

	start := time.Now()

	website, err := seo.ExtractWebsite(event.Link)

	if err != nil {
		log.Error("failed", zap.Error(err), zap.String("eventId", event.Id))
	}

	log.Info("complete", zap.Duration("duration", time.Since(start)), zap.String("eventId", event.Id))

	log.Info("result", zap.Any("website", website))
}
