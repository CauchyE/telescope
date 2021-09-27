package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

type Config struct {
	HealthURL       string            `json:"health_url"`
	APIMap          map[string]string `json:"api_map"`
	SlackWebhookURL string            `json:"slack_webhook_url"`
	SlackChannel    string            `json:"slack_channel"`
	DBPath          string            `json:"db_path"`
}

func LoadConfig() (*Config, error) {
  path := os.ExpandEnv("$HOME/monitor/config.json")
	bz, err := ioutil.ReadFile(path)
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
