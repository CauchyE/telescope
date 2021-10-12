import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi/api';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pageSizeOptions = [5, 10, 20, 50, 100];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  pageLength$: BehaviorSubject<number> = new BehaviorSubject(0);

  txsTotalCount$: Observable<bigint>;
  txsPageOffset$: Observable<bigint>;

  pollingInterval = 30;
  txs$?: Observable<CosmosTxV1beta1GetTxsEventResponseTxResponses[] | undefined>;
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
    this.txsPageOffset$ = combineLatest([this.pageNumber$, this.pageSize$]).pipe(
      map(([pageNumber, pageSize]) => {
        const pageOffset = pageSize * (pageNumber - 1) + 1;
        return BigInt(pageOffset);
      }),
    );
    this.txsTotalCount$ = combineLatest([
      sdk$,
      this.pageSize$,
      this.txsPageOffset$,
      this.selectedTxType$,
    ]).pipe(
      switchMap(([sdk, _pageSize, _pageOffset, selectedTxType]) => {
        return rest.cosmos.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            undefined,
            undefined,
            true,
          )
          .then((res) =>
            res.data.pagination?.total ? BigInt(res.data.pagination?.total) : BigInt(0),
          )
          .catch((error) => {
            console.error(error);
            return BigInt(0);
          });
      }),
    );
    this.txsTotalCount$.subscribe((txsTotalCount) => {
      this.pageLength$.next(parseInt(txsTotalCount.toString()));
    });
    this.txs$ = combineLatest([
      sdk$,
      this.selectedTxType$,
      this.pageSize$.asObservable(),
      this.txsPageOffset$,
      this.txsTotalCount$,
    ]).pipe(
      filter(
        ([_sdk, _selectedTxType, _pageSize, _pageOffset, txTotalCount]) =>
          txTotalCount !== BigInt(0),
      ),
      switchMap(([sdk, selectedTxType, pageSize, pageOffset, _txTotalCount]) => {
        return rest.cosmos.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            pageOffset,
            BigInt(pageSize),
            true,
          )
          .then((res) => {
            return res.data.tx_responses;
          });
      }),
    );
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }

  appPaginationChanged(pageEvent: PageEvent): void {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
  }
}
