import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi/api';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pageSizeOptions = [5, 10, 20];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  pageLength$: BehaviorSubject<number> = new BehaviorSubject(1000);

  latestTxHeight$ = new BehaviorSubject(BigInt(20));
  firstTxHeight$ = new BehaviorSubject(BigInt(20));
  num_: bigint | undefined;

  pollingInterval = 30;
  latestTxs$?: Observable<CosmosTxV1beta1GetTxsEventResponseTxResponses[] | undefined>;
  txTypeOptions?: string[];
  selectedTxType$: BehaviorSubject<string> = new BehaviorSubject('bank');

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private configService: ConfigService,
  ) {
    this.txTypeOptions = this.configService.config.extension?.messageModules;
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestTxs$ = combineLatest([sdk$, this.selectedTxType$]).pipe(
      mergeMap(([sdk, selectedTxType]) => {
        rest.cosmos.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined, // Todo: for pagination
            undefined, // Todo: for pagination
            undefined, // Todo: for pagination
          )
          .then((res) => {
            const arr = res.data.tx_responses;
            if (arr === undefined) {
            } else {
              this.num_ = BigInt(arr.length);
            }
            console.log('txs_no_number', this.num_);
            console.log('latestTxHeight$', this.latestTxHeight$.getValue());
            console.log('pageSize$', this.pageSize$.getValue());
            console.log('pageNumber$', this.pageNumber$.getValue());
            console.log('pageLength$', this.pageLength$.getValue());
          });

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
          });
      }),
      map((latestTxs) => latestTxs?.reverse()),
    );
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }

  appPaginationChanged(pageEvent: PageEvent): void {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
    const paginatedTxHeight =
      this.latestTxHeight$.getValue() - BigInt(pageEvent.pageIndex) * BigInt(pageEvent.pageSize);
    this.firstTxHeight$.next(paginatedTxHeight);
  }
}
