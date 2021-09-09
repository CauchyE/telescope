package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
)

var monitor *Monitor
var rootCmd = &cobra.Command{
	Use:          "monitor",
	Short:        "Cosmos SDK blockchain monitor",
	SilenceUsage: true,
}

func fetchCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "fetch [\"yyyy/MM/dd\"]",
		Args: cobra.ExactArgs(1),
		RunE: runFetch,
	}
}

func serveCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "serve",
		RunE: runFetch,
	}
}

func runFetch(cmd *cobra.Command, args []string) error {
	return monitor.Fetch(args[0])
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
		start := params["start"]
		count := params["count"]

		bz, err := monitor.List(start, count)
		if err != nil {
			fmt.Fprint(w, "error")
		}

		json, _ := json.MarshalIndent(bz, "", "  ")
		fmt.Fprint(w, json)
	}
}

func init() {
	rootCmd.AddCommand(
		fetchCmd(),
		serveCmd(),
	)

	var err error
	monitor, err = NewMonitor(os.Getenv("MONITOR_DB_PATH"), os.Getenv("SLACK_WEBHOOK_URL"), os.Getenv("SLACK_CHANNEL"))
	if err != nil {
		os.Exit(1)
	}
}

func main() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
