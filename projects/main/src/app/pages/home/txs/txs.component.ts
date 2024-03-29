import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20075TxResponse } from '@cosmos-client/core/esm/openapi/api';
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
  pollingInterval = 30 * 60;
  txs$?: Observable<InlineResponse20075TxResponse[] | undefined>;
  txTypeOptions?: string[];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(20);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  txsTotalCount$: Observable<bigint>;
  txsPageOffset$: Observable<bigint>;
  selectedTxType$: BehaviorSubject<string> = new BehaviorSubject('bank');

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private configService: ConfigService,
  ) {
    this.txTypeOptions = this.configService.config.extension?.messageModules;
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));

    this.txsTotalCount$ = combineLatest([
      sdk$,
      this.pageNumber$,
      this.pageSize$,
      this.selectedTxType$,
    ]).pipe(
      switchMap(([sdk, _pageNumber, _pageSize, selectedTxType]) => {
        return rest.tx
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

    this.txsPageOffset$ = combineLatest([
      this.pageNumber$,
      this.pageSize$,
      this.txsTotalCount$,
    ]).pipe(
      map(([pageNumber, pageSize, txsTotalCount]) => {
        const pageOffset = txsTotalCount - BigInt(pageSize) * BigInt(pageNumber);
        return pageOffset;
      }),
    );

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
      switchMap(([sdk, selectedTxType, pageSize, pageOffset, _txsTotalCount]) => {
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize = pageOffset < 1 ? pageOffset + BigInt(pageSize) : BigInt(pageSize);

        if (modifiedPageOffset <= 0 || modifiedPageSize <= 0) {
          return [];
        }

        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            modifiedPageOffset,
            modifiedPageSize,
            true,
          )
          .then((res) => {
            return res.data.tx_responses;
          })
          .catch((error) => {
            console.error(error);
            return [];
          });
      }),
      map((txs) => txs?.reverse()),
    );
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }
}
