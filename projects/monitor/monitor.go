package main

import (
	"bytes"
	"encoding/json"
	"github.com/syndtr/goleveldb/leveldb"
	"github.com/syndtr/goleveldb/leveldb/opt"
	"net/http"
)

type Monitor struct {
	SlackWebhookURL string
	SlackChannel    string
	DB              *leveldb.DB
}

type Data struct{}

func NewMonitor(dbPath string, slackWebhookURL string, slackChannel string) (*Monitor, error) {
	db, err := leveldb.OpenFile(dbPath, &opt.Options{})
	if err != nil {
		return nil, err
	}

	return &Monitor{
		SlackWebhookURL: slackWebhookURL,
		SlackChannel:    slackChannel,
		DB:              db,
	}, nil
}

func (monitor *Monitor) Fetch(yyyyMMdd string) error {
	return nil
}

func (monitor *Monitor) List(start string, count uint32) (*Data, error) {

	return &Data{}, nil
}

func (monitor *Monitor) postSlack(text string) error {
	body := map[string]string{
		"channel": monitor.SlackChannel,
		"text":    text,
	}
	b, _ := json.Marshal(&body)

	_, err := http.Post(monitor.SlackWebhookURL, "application/json", bytes.NewBuffer(b))

	return err
}
