package logger

import (
	"go.uber.org/zap"
)

var Log *zap.Logger

func Init() {
	var err error
	Log, err = zap.NewDevelopment(
		zap.Fields(
			zap.String("service", "logger"),
		),
	)

	if err != nil {
		panic(err)
	}
}

func NewWorkerLogger(serviceName string) *zap.Logger {
	log, err := zap.NewDevelopment(
		zap.Fields(zap.String("wid", serviceName)),
	)
	if err != nil {
		panic(err)
	}
	return log
}
