import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest, websocket } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pollingInterval = 30;
  initialTxs$?: Observable<CosmosTxV1beta1GetTxsEventResponseTxResponses[] | undefined>;
  latestTxs$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;
  txTypeOptions?: string[];
  selectedTxType$: BehaviorSubject<string> = new BehaviorSubject('bank');

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService, private configService: ConfigService) {
    this.txTypeOptions = this.configService.config.extension?.messageModules
    const timer$ = timer(0, this.pollingInterval * 1000);
    // eslint-disable-next-line no-unused-vars
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.initialTxs$ = combineLatest([sdk$, this.selectedTxType$]).pipe(
      mergeMap(([sdk, selectedTxType]) =>
        rest.cosmos.tx
          .getTxsEvent(sdk.rest, [`message.module='${selectedTxType}'`])
          .then((res) => res.data.tx_responses),
      ),
      map((initialTxs) => initialTxs?.reverse()),
    );

    /*
    this.cosmosSDK.websocketURL$.pipe(first()).subscribe((websocketURL) => {
      const ws = websocket.connect(websocketURL);
      ws.next({
        id: '1',
        jsonrpc: '2.0',
        method: 'subscribe',
        params: [`tm.event = 'Tx'`],
      });

      //暫定的に自動削除用のコードを無効化
      this.initialTxs$ = initial;
      // websocket有効化後、自動削除を有効に
      this.initialTxs$ = combineLatest([initial, ws.asObservable()]).pipe(
        map(([init, latest]) => {
          (latest as websocket.ResponseSchema).result.data !== undefined
            ? (init?.shift()) as CosmosTxV1beta1GetTxsEventResponseTxResponses[]
            : init;
          return init;
        }),
      );

      this.latestTxs$ = ws.asObservable().pipe(
        scan<any>((all, current) => [current, ...all], []),
        map((data) => {
          data[0].result.data === undefined ? data.pop() : data;
          return data;
        }),
        map((data) => {
          data.length > 20 ? data.pop() : data;
          return data;
        }),
      );
    });
    */
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }
}