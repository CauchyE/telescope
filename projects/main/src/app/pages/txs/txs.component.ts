import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20075TxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { of, BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { filter, map, mergeMap, switchMap, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';


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
  pageSizeOptions = [5, 10, 20, 50, 100];
  pageLength$: Observable<number | undefined>;

  paginationInfo$: Observable<PaginationInfo>;
  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;
  defaultTxType = 'bank';
  txsTotalCount$: Observable<bigint>;

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
    const sdk$ = timer$.pipe(mergeMap((_) => {
      console.log("time 30 seconds")
      return this.cosmosSDK.sdk$
    }));

    this.selectedTxType$ = this.route.queryParams.pipe(
      distinctUntilChanged(),
      map((params) => {
        if (this.txTypeOptions?.includes(params.txType)) {
          console.log("selected", params.txType)
          return params.txType;
        } else {
          console.log("this.defaultTxType", params.txType)
          return this.defaultTxType;
        }
      }),
    );

    this.txsTotalCount$ = combineLatest([
      sdk$,
      this.selectedTxType$,
    ]).pipe(
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

    // どちらを先にするか。this.txsTotalCount$が先だと更新が遅くなる。this.route.queryParamsが先だと一発目リストが表示されない。
    this.paginationInfo$ = this.route.queryParams.pipe(
      withLatestFrom(this.txsTotalCount$),
      map(([params, txTotalCount,]) => {

        //get page size from query param
        const pageSize = this.pageSizeOptions.includes(Number(params.perPage)) ? Number(params.perPage) : this.defaultPageSize;

        //get page number from query param
        const pages = Number(params.pages)
        const pageNumber = (txTotalCount === undefined || !pages || pages > Number(txTotalCount) / pageSize + 1) ? this.defaultPageNumber : pages

        console.log({ pageSize, pageNumber })
        return { pageNumber, pageSize }
      }
      )
    )

    this.txs$ = this.paginationInfo$.pipe(
      withLatestFrom(
        sdk$,
        this.selectedTxType$,
        this.txsTotalCount$),
      /*
    filter(
      ([_paginationInfo, _sdk, _selectedTxType, txTotalCount,]) =>
        txTotalCount !== BigInt(0),
    ),*/
      mergeMap(([paginationInfo, sdk, selectedTxType, txsTotalCount]) => {

        const pageOffset = txsTotalCount - BigInt(paginationInfo.pageSize) * BigInt(paginationInfo.pageNumber);
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize = pageOffset < 1 ? pageOffset + BigInt(paginationInfo.pageSize) : BigInt(paginationInfo.pageSize);
        // Note: This is strange. This is temporary workaround way.
        const temporaryWorkaroundPageSize =
          txsTotalCount === BigInt(1) &&
            modifiedPageOffset === BigInt(1) &&
            modifiedPageSize === BigInt(1)
            ? modifiedPageSize + BigInt(1)
            : modifiedPageSize;

        console.log({ selectedTxType, paginationInfo, pageOffset, modifiedPageOffset, modifiedPageSize })

        /*
        if (modifiedPageOffset <= 0 || modifiedPageSize <= 0) {
          console.log("return []")
          return [];
        }
        */

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
            console.log("sss", res)
            return res.data.tx_responses;
          })
          .catch((error) => {
            console.error(error);
            console.log("error1", { selectedTxType, pageOffset, txsTotalCount })
            return [];
          });
      }),
      map((latestTxs) => {
        console.log("OK", latestTxs?.length, typeof latestTxs)
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
    //this.txs$ = of([])
    console.log("txtype change")
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
    console.log("pagination change")
  }
}
