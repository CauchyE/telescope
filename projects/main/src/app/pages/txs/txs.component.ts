import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css']
})
export class TxsComponent implements OnInit {
  pollingInterval = 30;
  latestTxs$?: Observable<CosmosTxV1beta1GetTxsEventResponseTxResponses[] | undefined>;
  txTypeOptions?: string[];
  selectedTxType$: BehaviorSubject<string> = new BehaviorSubject('bank');

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService, private configService: ConfigService) {
    this.txTypeOptions = this.configService.config.extension?.messageModules;
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestTxs$ = combineLatest([sdk$, this.selectedTxType$]).pipe(
      mergeMap(([sdk, selectedTxType]) => {
        return rest.cosmos.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined, // Todo: for pagination
            undefined, // Todo: for pagination
            undefined, // Todo: for pagination
          )
          .then((res) => {
            return res.data.tx_responses;
          })
      }),
      map((latestTxs) => latestTxs?.reverse())
    );
  }

  ngOnInit(): void { }

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }
}
