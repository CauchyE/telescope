import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { auth } from 'cosmos-client/x/auth';
import { PaginatedQueryTxs } from 'cosmos-client/api';
import { CosmosSDKService } from '@model/index';
import { tendermint } from 'cosmos-client';
import { HttpClient } from '@angular/common/http';
import * as config from '../../config.json';

type NodeInfo = {
  application_version: {
    build_tags: string;
    client_name: string;
    commit: string;
    go: string;
    name: string;
    server_name: string;
    version: string;
  };
  node_info: {
    id: string;
    moniker: string;
    protocol_version: {
      p2p: number;
      block: number;
      app: number;
    };
    network: string;
    channels: string;
    listen_addr: string;
    version: string;
    other: {
      tx_index: string;
      rpc_address: string;
    };
  };
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  nodeInfo$: Observable<NodeInfo>; // TODO
  syncing$: Observable<boolean>;
  messageActions: string[];
  messageAction$: BehaviorSubject<string>;
  txs$: Observable<PaginatedQueryTxs>;

  constructor(private cosmosSDK: CosmosSDKService, private http: HttpClient) {
    const timer$ = timer(0, 60 * 1000);

    // TODO
    this.nodeInfo$ = timer$.pipe(
      mergeMap((_) =>
        this.http.get<NodeInfo>(`${this.cosmosSDK.sdk.url}/node_info`),
      ),
    );

    this.syncing$ = timer$.pipe(
      mergeMap((_) =>
        tendermint
          .syncingGet(this.cosmosSDK.sdk)
          .then((res) => res.data.syncing || false),
      ),
    );

    this.messageActions = ['send'].concat(
      config.extension.message_actions.filter(
        (messageAction) => !!messageAction,
      ),
    );

    this.messageAction$ = new BehaviorSubject('send');

    this.txs$ = combineLatest([timer$, this.messageAction$]).pipe(
      mergeMap(([_, messageAction]) =>
        auth.txsGet(this.cosmosSDK.sdk, messageAction).then((res) => res.data),
      ),
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.messageAction$.complete();
  }

  onMessageActionChange($event: string) {
    this.messageAction$.next($event);
  }
}
