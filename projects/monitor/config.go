package main

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	HealthURL       string            `json:"health_url"`
	APIMap          map[string]string `json:"api_map"`
	SlackWebhookURL string            `json:"slack_webhook_url"`
	SlackChannel    string            `json:"slack_channel"`
	DBPath          string            `json:"db_path"`
}

func LoadConfig() (*Config, error) {
	bz, err := ioutil.ReadFile("./config.json")
	if err != nil {
		return nil, err
	}
	var config Config
	err = json.Unmarshal(bz, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
