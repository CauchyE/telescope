package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/btcsuite/goleveldb/leveldb"
	"github.com/btcsuite/goleveldb/leveldb/opt"
	tmLog "github.com/tendermint/tendermint/libs/log"
	"github.com/tendermint/tendermint/proto/tendermint/types"
	tmHttp "github.com/tendermint/tendermint/rpc/client/http"
	tmTypes "github.com/tendermint/tendermint/types"
)

type Preserver struct {
	Logger           tmLog.Logger
	TendermintClient *tmHttp.HTTP
	DB               *leveldb.DB
}

func NewPreserver() (Preserver, error) {
	logger := tmLog.NewTMLogger(tmLog.NewSyncWriter(os.Stdout))
	tendermintClient, err := tmHttp.New(os.Getenv("TENDERMINT_RPC_HOST"), "/websocket")
	if err != nil {
		return Preserver{}, err
	}
	tendermintClient.SetLogger(logger)

	db, err := leveldb.OpenFile(os.Getenv("DB_FILE_PATH"), &opt.Options{})
	if err != nil {
		return Preserver{}, err
	}

	return Preserver{
		Logger:           logger,
		TendermintClient: tendermintClient,
		DB:               db,
	}, nil
}

func (p Preserver) GetByHeight(height string) (*types.Block, error) {
	bz, err := p.DB.Get([]byte(height), &opt.ReadOptions{})
	if err != nil {
		return nil, err
	}
	var block types.Block
	err = block.Unmarshal(bz)
	if err != nil {
		return nil, err
	}

	return &block, nil
}

func (p Preserver) Start(exitSignal chan os.Signal) {
	err := p.TendermintClient.Start()
	if err != nil {
		p.Logger.Error("Failed to start a client", "err", err)
		os.Exit(1)
	}
	defer p.TendermintClient.Stop()

	query := fmt.Sprintf("tm.event = 'NewBlock' AND %s", os.Getenv("TENDERMINT_QUERY"))
	out, err := p.TendermintClient.Subscribe(context.Background(), "test", query, 1000)
	if err != nil {
		p.Logger.Error("Failed to subscribe to query", "err", err, "query", query)
		postSlack("Failed to subscribe to query")
		os.Exit(1)
	}

	for {
		select {
		case result := <-out:
			block, ok := result.Data.(tmTypes.Block)
			if !ok {
				p.Logger.Error("Type casting failed")
			}

			blockProto, err := block.ToProto()
			if err != nil {
				p.Logger.Error("ToProto failed")
			}

			bz, err := blockProto.Marshal()
			if err != nil {
				p.Logger.Error("Proto marshal failed")
			}

			p.DB.Put([]byte(fmt.Sprintf("%d", block.Height)), bz, &opt.WriteOptions{})
		case <-exitSignal:
			postSlack("Finished subscribing to query")
			return
		}
	}
}

func postSlack(text string) error {
	url := os.Getenv("SLACK_WEBHOOK_URL")
	body := map[string]string{
		"channel": os.Getenv("SLACK_CHANNEL"),
		"text":    text,
	}
	b, _ := json.Marshal(&body)

	_, err := http.Post(url, "application/json", bytes.NewBuffer(b))

	return err
}
