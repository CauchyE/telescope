package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

var monitor *Monitor
var rootCmd = &cobra.Command{
	Use:          "monitor",
	Short:        "Cosmos SDK blockchain monitor",
	SilenceUsage: true,
}

func healthCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "health",
		RunE: runHealth,
	}
}

func fetchCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "fetch [year] [month] [date]",
		Args: cobra.ExactArgs(3),
		RunE: runFetch,
	}
}

func serveCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "serve",
		RunE: runFetch,
	}
}

func runHealth(cmd *cobra.Command, args []string) error {
	return monitor.Health()
}

func runFetch(cmd *cobra.Command, args []string) error {
	date, err := NewDate(args[0], args[1], args[2])
	if err != nil {
		return err
	}
	return monitor.Fetch(date)
}

func runServe(cmd *cobra.Command, args []string) error {
	router := mux.NewRouter()
	router.HandleFunc("/list", getHandlerFactory(monitor)).Methods("GET")
	http.Handle("/", router)
	http.ListenAndServe(os.Getenv("MONITOR_PORT"), nil)

	return nil
}

func getHandlerFactory(monitor *Monitor) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		year := params["start.year"]
		month := params["start.month"]
		day := params["start.day"]
		start, err := NewDate(year, month, day)
		if err != nil {
			fmt.Fprint(w, "error")
		}

		count, err := strconv.Atoi(params["count"])

		bz, err := monitor.List(start, uint(count))
		if err != nil {
			fmt.Fprint(w, "error")
		}

		json, _ := json.MarshalIndent(bz, "", "  ")
		fmt.Fprint(w, json)
	}
}

type Config struct {
	HealthURL       string            `json:"health_url"`
	APIMap          map[string]string `json:"api_map"`
	SlackWebhookURL string            `json:"slack_webhook_url"`
	SlackChannel    string            `json:"slack_channel"`
	DBPath          string            `json:"db_path"`
}

func init() {
	bz, err := ioutil.ReadFile("./config.json")
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	var config Config
	err = json.Unmarshal(bz, &config)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	monitor, err = NewMonitor(config.HealthURL, config.APIMap, config.SlackWebhookURL, config.SlackChannel, config.DBPath)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	rootCmd.AddCommand(
		healthCmd(),
		fetchCmd(),
		serveCmd(),
	)
}

func main() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
