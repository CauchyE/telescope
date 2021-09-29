package main

import (
	"encoding/json"
	"fmt"
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

func timeFromString(year string, month string, day string) (*time.Time, error) {
	t, err := time.Parse("2006-01-02", fmt.Sprintf("%04s-%02s-%02s", year, month, day))
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func healthCmd() *cobra.Command {
	return &cobra.Command{
		Use: "health",
		RunE: func(cmd *cobra.Command, args []string) error {
			return monitor.Health()
		},
	}
}

func fetchCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "fetch [year] [month] [date]",
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			t, err := timeFromString(args[0], args[1], args[2])
			if err != nil {
				return err
			}
			return monitor.Fetch(t)
		},
	}
}

func serveCmd() *cobra.Command {
	return &cobra.Command{
		Use:  "serve [port]",
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			port, err := strconv.Atoi(args[0])
			if err != nil {
				return err
			}

      // update 1 min
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
			router.HandleFunc("/list", listHandlerFactory(monitor)).Queries("start_year","{start_year}").Queries("start_month","{start_month}").Queries("start_day", "{start_day}").Queries("count", "{count}").Methods("GET")

	  	http.Handle("/", router)
		  http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

			return nil
		},
	}
}

func listHandlerFactory(monitor *Monitor) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Headers", "*")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set( "Access-Control-Allow-Methods","GET, OPTIONS" )

		params := mux.Vars(r)
		year := params["start_year"]
		month := params["start_month"]
		day := params["start_day"]

		start, err := timeFromString(year, month, day)
		if err != nil {
			fmt.Fprint(w, "error")
      return
		}

		count, _ := strconv.Atoi(params["count"])

		bz, err := monitor.List(start, uint(count))
		if err != nil {
			fmt.Fprint(w, "error")
      return
		}

		json, _ := json.MarshalIndent(bz, "", "  ")
		fmt.Fprint(w, string(json))
	}
}

func init() {
	config, err := LoadConfig()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	monitor, err = NewMonitor(config.HealthURL, config.APIMap, config.SlackWebhookURL, config.SlackChannel)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

  // default true => false
	serveCmd().Flags().BoolVar(&cronFlag, "cron", true, "--cron=true")

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
