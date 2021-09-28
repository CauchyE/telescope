package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/syndtr/goleveldb/leveldb"
	"github.com/syndtr/goleveldb/leveldb/opt"
)

type Monitor struct {
	HealthURL       string
	APIMap          map[string]string
	SlackWebhookURL string
	SlackChannel    string
	DB              *leveldb.DB
}

type Data struct {
	BeforeDate *time.Time
	Result     map[string]json.RawMessage
}

func NewMonitor(healthURL string, apiMap map[string]string, slackWebhookURL string, slackChannel string) (*Monitor, error) {
	path := os.ExpandEnv("$HOME/monitor/db")
	db, err := leveldb.OpenFile(path, &opt.Options{})
	if err != nil {
		return nil, err
	}

	return &Monitor{
		HealthURL:       healthURL,
		APIMap:          apiMap,
		SlackWebhookURL: slackWebhookURL,
		SlackChannel:    slackChannel,
		DB:              db,
	}, nil
}

func (monitor *Monitor) Close() {
	monitor.DB.Close()
}

func (monitor *Monitor) Health() error {
	res, err := http.Get(monitor.HealthURL)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	return nil
}

func (monitor *Monitor) Fetch(t *time.Time) error {
	result := make(map[string]json.RawMessage)

	// iterate api map
	for k, v := range monitor.APIMap {
		res, err := http.Get(v)
		if err != nil {
			continue
		}
		defer res.Body.Close()

		bz, err := ioutil.ReadAll(res.Body)
		if err != nil {
			continue
		}

		// set result
		result[k] = json.RawMessage(bz)
	}
	// unmarshal all results
	bz, _ := json.MarshalIndent(result, "", "  ")

	// put
	err := monitor.DB.Put([]byte(t.Format("")), bz, &opt.WriteOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (monitor *Monitor) List(start *time.Time, count uint) ([]Data, error) {
	var data []Data
	key := []byte(start.Format("2006-01-02"))

	for i := uint(0); i < count; i++ {
		bz, err := monitor.DB.Get(key, &opt.ReadOptions{})
		if err != nil {
			return nil, err
		}
		// unmarshal
		var buffer Data
		json.Unmarshal(bz, &buffer)

		// append
		data = append(data, buffer)

		// set next key to get
		key = []byte(buffer.BeforeDate.Format("2006-01-02"))
	}

	return data, nil
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
