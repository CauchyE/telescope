package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
)

func handlerFactory(p Preserver) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		height := params["height"]

		bz, err := p.GetByHeight(height)
		if err != nil {
			fmt.Fprint(w, "error")
		}

		json, _ := json.MarshalIndent(bz, "", "  ")
		fmt.Fprint(w, json)
	}
}

func run() error {
	exitSignal := make(chan os.Signal, 1)
	signal.Notify(exitSignal, syscall.SIGINT, syscall.SIGTERM)

	preserver, err := NewPreserver()
	if err != nil {
		return err
	}

	go preserver.Start(exitSignal)
	<-exitSignal

	router := mux.NewRouter()
	router.HandleFunc("/{height}", handlerFactory(preserver)).Methods("GET")
	http.Handle("/", router)
	http.ListenAndServe(os.Getenv("PRESERVER_PORT"), nil)

	return nil
}

func main() {
	run()
}
