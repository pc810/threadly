package logger

import (
	"go.uber.org/zap"
)

var Log *zap.Logger

func Init(service_name string) {
	var err error
	Log, err = zap.NewDevelopment(
		zap.Fields(
			zap.String("service", service_name),
		),
	)

	if err != nil {
		panic(err)
	}
}

func NewWorkerLogger(serviceName string) *zap.Logger {
	log, err := zap.NewDevelopment(
		zap.Fields(zap.String("worker", serviceName)),
	)
	if err != nil {
		panic(err)
	}
	return log
}
