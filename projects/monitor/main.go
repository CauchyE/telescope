package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/spf13/cobra"

	"github.com/robfig/cron/v3"
)

var cronFlag bool
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
		Use:  "serve [port]",
		Args: cobra.ExactArgs(1),
		RunE: runServe,
	}
}

func runHealth(cmd *cobra.Command, args []string) error {
	return monitor.Health()
}

func runFetch(cmd *cobra.Command, args []string) error {
	t, err := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-%s", args[0], args[1], args[2]))
	if err != nil {
		return err
	}
	return monitor.Fetch(&t)
}

func runServe(cmd *cobra.Command, args []string) error {
	port, err := strconv.Atoi(args[0])
	if err != nil {
		return err
	}

	if cronFlag {
		c := cron.New()
		c.AddFunc("0 * * * *", func() {
			monitor.Health()
		})
		c.AddFunc("0 0 * * *", func() {
			now := time.Now()
			monitor.Fetch(&now)
		})

		c.Start()
	}

	router := mux.NewRouter()
	router.HandleFunc("/list", getHandlerFactory(monitor)).Methods("GET")
	http.Handle("/", router)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

	return nil
}

func getHandlerFactory(monitor *Monitor) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		year := params["start.year"]
		month := params["start.month"]
		day := params["start.day"]
		start, err := time.Parse("2006-01-02", fmt.Sprintf("%s-%s-%s", year, month, day))
		if err != nil {
			fmt.Fprint(w, "error")
		}

		count, err := strconv.Atoi(params["count"])

		bz, err := monitor.List(&start, uint(count))
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

	serveCmd().Flags().BoolVar(&cronFlag, "cron", false, "--cron=true")

	rootCmd.AddCommand(
		healthCmd(),
		fetchCmd(),
		serveCmd(),
	)
}

func main() {
	defer monitor.Close()
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
