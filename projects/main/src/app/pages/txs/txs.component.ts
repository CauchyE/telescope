import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20075TxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { of, combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap, switchMap, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';

export type PaginationInfo = {
  pageSize: number;
  pageNumber: number;
};

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pollingInterval = 30;
  pageSizeOptions = [5, 10, 20, 50, 100];
  txTypeOptions?: string[];

  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;
  defaultTxType = 'bank';

  selectedTxType$: Observable<string>;
  selectedTxTypeChanged$: Observable<string>;
  txsTotalCount$: Observable<bigint>;
  paginationInfo$: Observable<PaginationInfo>;
  paginationInfoChanged$: Observable<PaginationInfo>;
  pageLength$: Observable<number | undefined>;
  txs$?: Observable<InlineResponse20075TxResponse[] | undefined>;

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
      map((params) =>
        this.txTypeOptions?.includes(params.txType) ? params.txType : this.defaultTxType,
      ),
    );

    this.selectedTxTypeChanged$ = this.selectedTxType$.pipe(
      distinctUntilChanged(),
      map((txType) => txType),
    );

    this.txsTotalCount$ = combineLatest([sdk$, this.selectedTxTypeChanged$]).pipe(
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

    this.paginationInfo$ = combineLatest([this.txsTotalCount$, this.route.queryParams]).pipe(
      switchMap(([txTotalCount, params]) => {
        //get page size from query param
        const pageSize = this.pageSizeOptions.includes(Number(params.perPage))
          ? Number(params.perPage)
          : this.defaultPageSize;

        //get page number from query param
        const pages = Number(params.pages);
        const pageNumber =
          txTotalCount === undefined || !pages || pages > Number(txTotalCount) / pageSize + 1
            ? this.defaultPageNumber
            : pages;

        return of({ pageNumber, pageSize });
      }),
    );

    this.paginationInfoChanged$ = this.paginationInfo$.pipe(
      distinctUntilChanged(),
      map((paginationInfo) => paginationInfo),
    );

    this.txs$ = this.paginationInfoChanged$.pipe(
      withLatestFrom(sdk$, this.selectedTxType$, this.txsTotalCount$),
      mergeMap(([paginationInfo, sdk, selectedTxType, txsTotalCount]) => {
        const pageOffset =
          txsTotalCount - BigInt(paginationInfo.pageSize) * BigInt(paginationInfo.pageNumber);
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize =
          pageOffset < 1
            ? pageOffset + BigInt(paginationInfo.pageSize)
            : BigInt(paginationInfo.pageSize);
        // Note: This is strange. This is temporary workaround way.
        const temporaryWorkaroundPageSize =
          txsTotalCount === BigInt(1) &&
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
          .then((res) => res.data.tx_responses)
          .catch((error) => {
            console.error(error);
            return [];
          });
      }),
      map((latestTxs) => latestTxs?.reverse()),
    );
  }

  ngOnInit(): void {}

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
