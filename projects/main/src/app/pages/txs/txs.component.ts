import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20075TxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { of, combineLatest, Observable, timer } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pageSizeOptions = [5, 10, 20, 50, 100];
  pageSize$: Observable<number>;
  pageNumber$: Observable<number>;
  pageLength$: Observable<number | undefined>;
  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;
  defaultTxType = 'bank';

  txsTotalCount$: Observable<bigint>;
  txsPageOffset$: Observable<bigint>;

  pollingInterval = 30;
  txs$?: Observable<InlineResponse20075TxResponse[] | undefined>;
  txTypeOptions?: string[];
  selectedTxType$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private configService: ConfigService,
  ) {
    this.txTypeOptions = this.configService.config.extension?.messageModules;
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));

    this.selectedTxType$ = this.route.queryParams.pipe(
      map((params) => {
        if (this.txTypeOptions?.includes(params.txType)) {
          return params.txType;
        } else {
          return this.defaultTxType;
        }
      }),
    );

    this.txsTotalCount$ = combineLatest([sdk$, this.selectedTxType$]).pipe(
      switchMap(([sdk, selectedTxType]) => {
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

    this.pageLength$ = this.txsTotalCount$.pipe(
      map((txsTotalCount) => (txsTotalCount ? parseInt(txsTotalCount.toString()) : undefined)),
    );

    this.pageSize$ = this.route.queryParams.pipe(
      map((params) => {
        if (params.perPage === undefined) {
          return this.defaultPageSize;
        }
        const pageSize = Number(params.perPage);
        if (this.pageSizeOptions.includes(pageSize)) {
          return pageSize;
        } else {
          return this.defaultPageSize;
        }
      }),
    );

    this.pageNumber$ = combineLatest([
      this.pageLength$,
      this.pageSize$,
      this.route.queryParams,
    ]).pipe(
      switchMap(([pageLength, pageSize, params]) => {
        const pages = Number(params.pages);
        if (pageLength === undefined || !pages || pages > pageLength / pageSize + 1) {
          return of(this.defaultPageNumber);
        }
        return of(pages);
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
      this.pageSize$,
      this.txsPageOffset$,
      this.txsTotalCount$,
    ]).pipe(
      filter(
        ([_sdk, _selectedTxType, _pageSize, _pageOffset, txTotalCount]) =>
          txTotalCount !== BigInt(0),
      ),
      switchMap(([sdk, selectedTxType, pageSize, pageOffset, txTotalCount]) => {
        //mergeMap(([sdk, selectedTxType, pageSize, pageOffset, txTotalCount]) => {
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize = pageOffset < 1 ? pageOffset + BigInt(pageSize) : BigInt(pageSize);
        // Note: This is strange. This is temporary workaround way.
        const temporaryWorkaroundPageSize =
          txTotalCount === BigInt(1) &&
            modifiedPageOffset === BigInt(1) &&
            modifiedPageSize === BigInt(1)
            ? modifiedPageSize + BigInt(1)
            : modifiedPageSize;

        if (modifiedPageOffset <= 0 || modifiedPageSize <= 0) {
          return [];
        }

        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            modifiedPageOffset,
            temporaryWorkaroundPageSize,
            true,
          )
          .then((res) => {
            return res.data.tx_responses;
          })
          .catch((error) => {
            console.error(error);
            console.log("error1", { selectedTxType, pageSize, pageOffset, txTotalCount })
            return [];
          });
      }),
      map((latestTxs) => {
        console.log("error2")
        return latestTxs?.reverse()
      }),
    );
  }

  ngOnInit(): void { }

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        txType: selectedTxType,
      },
      queryParamsHandling: 'merge',
    });
  }

  appPaginationChanged(pageEvent: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        perPage: pageEvent.pageSize,
        pages: pageEvent.pageIndex + 1,
      },
      queryParamsHandling: 'merge',
    });
  }
}
