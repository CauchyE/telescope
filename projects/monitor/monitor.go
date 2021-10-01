package main

import (
	"bytes"
	"encoding/json"
	"fmt"
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
	BeforeDate *time.Time                 `json:"before_date"`
	Date       *time.Time                 `json:"date"`
	Result     map[string]json.RawMessage `json:"result"`
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
		monitor.postSlack(fmt.Sprintf("health failed: %s", err.Error()))
		return err
	}
	defer res.Body.Close()

	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		monitor.postSlack(fmt.Sprintf("health failed: %s", err.Error()))
		return err
	}

	return nil
}

func (monitor *Monitor) Fetch() error {
	now := time.Now()
	result := make(map[string]json.RawMessage)

	// iterate api map
	for k, v := range monitor.APIMap {
		res, err := http.Get(v)
		if err != nil {
			monitor.postSlack(fmt.Sprintf("fetch failed: %s", err.Error()))
			continue
		}
		defer res.Body.Close()

		bz, err := ioutil.ReadAll(res.Body)
		if err != nil {
			monitor.postSlack(fmt.Sprintf("fetch failed: %s", err.Error()))
			continue
		}

		// set result
		result[k] = json.RawMessage(bz)
	}

	lastFetchDate := monitor.GetLastFetchDate()

	data := Data{
		BeforeDate: lastFetchDate,
		Date:       &now,
		Result:     result,
	}

	err := monitor.SetData(&now, &data)
	if err != nil {
		return err
	}
	err = monitor.SetLastFetchDate(&now)
	if err != nil {
		return err
	}

	return nil
}

func (monitor *Monitor) GetData(t *time.Time) (*Data, error) {
	key := []byte(t.Format(time.RFC3339))
	bz, err := monitor.DB.Get(key, &opt.ReadOptions{})
	if err != nil {
		return nil, err
	}
	var data Data
	err = json.Unmarshal(bz, &data)

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (monitor *Monitor) SetData(t *time.Time, data *Data) error {
	key := []byte(t.Format(time.RFC3339))
	bz, _ := json.MarshalIndent(data, "", "  ")

	err := monitor.DB.Put(key, bz, &opt.WriteOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (monitor *Monitor) GetLastFetchDate() *time.Time {
	key := []byte("last_fetch_date")
	bz, err := monitor.DB.Get(key, &opt.ReadOptions{})
	if err != nil {
		return nil
	}
	lastFetchDate, err := time.Parse(time.RFC3339, string(bz))

	if err != nil {
		return nil
	}

	return &lastFetchDate
}

func (monitor *Monitor) SetLastFetchDate(t *time.Time) error {
	key := []byte("last_fetch_date")
	bz := []byte(t.Format(time.RFC3339))
	err := monitor.DB.Put(key, bz, &opt.WriteOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (monitor *Monitor) List(start *time.Time, count uint) ([]Data, error) {
	data := []Data{}
	lastFetchDate := monitor.GetLastFetchDate()

	for {
		if lastFetchDate == nil || lastFetchDate.Before(*start) {
			break
		}
		datum, err := monitor.GetData(lastFetchDate)
		if err != nil {
			return data, err
		}
		data = append(data, *datum)

		lastFetchDate = datum.BeforeDate
	}

	length := len(data)
	cnt := int(count)
	if length > cnt {
		data = data[length-1-cnt : length-1]
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
