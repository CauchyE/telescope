import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { Observable, of, zip, timer, combineLatest } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pageSizeOptions = [5, 10, 20];
  pageSize$: Observable<number>;
  pageNumber$: Observable<number>;
  pageLength$: Observable<number>;

  pollingInterval = 30;
  latestBlock$: Observable<InlineResponse20035 | undefined>;
  latestBlockHeight$: Observable<bigint>;
  latestBlocks$: Observable<InlineResponse20036[] | undefined>;
  firstBlockHeight$: Observable<bigint>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
  ) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestBlock$ = sdk$.pipe(
      mergeMap((sdk) => rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)),
    );

    this.latestBlockHeight$ = this.latestBlock$.pipe(
      map((latestBlock) =>
        latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : BigInt(20),
      ),
    );

    this.pageLength$ = this.latestBlock$.pipe(
      map((latestBlock) =>
        latestBlock?.block?.header?.height ? parseInt(latestBlock.block.header.height) : 1000,
      ),
    );

    this.pageSize$ = this.route.queryParams.pipe(
      map((params) => {
        const pageSize: number = Number(params.perPage);
        if (this.pageSizeOptions.includes(pageSize)) {
          return pageSize;
        } else {
          return 10;
        }
      }),
    );

    this.pageNumber$ = combineLatest([
      this.pageLength$,
      this.pageSize$,
      this.route.queryParams,
    ]).pipe(
      map(([pageLength, pageSize, params]) => {
        const pages = Number(params.pages);
        if (!pages) return 1;
        if (pages > pageLength / pageSize + 1) return 1;
        return pages;
      }),
    );

    this.firstBlockHeight$ = combineLatest([
      this.latestBlockHeight$,
      this.pageNumber$,
      this.pageSize$,
    ]).pipe(
      switchMap(([latestBlockHeight, pageNumber, perPage]) => {
        const paginatedBlockHeight =
          latestBlockHeight - BigInt(pageNumber - 1) * BigInt(perPage) > 0
            ? latestBlockHeight - BigInt(pageNumber - 1) * BigInt(perPage)
            : BigInt(100);
        return of(paginatedBlockHeight);
      }),
    );

    this.latestBlocks$ = combineLatest([this.firstBlockHeight$, this.pageSize$]).pipe(
      map(([firstBlockHeight, pageSize]) =>
        [...Array(pageSize < firstBlockHeight ? pageSize : Number(firstBlockHeight)).keys()].map(
          (index) => {
            const tempLatestBlockHeight =
              firstBlockHeight === undefined ? BigInt(0) : firstBlockHeight;
            return tempLatestBlockHeight - BigInt(index);
          },
        ),
      ),
      mergeMap((blockHeights) =>
        zip(
          ...blockHeights.map((blockHeight) =>
            this.cosmosSDK.sdk$.pipe(
              mergeMap((sdk) =>
                rest.tendermint.getBlockByHeight(sdk.rest, blockHeight).then((res) => res.data),
              ),
            ),
          ),
        ),
      ),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void {}

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
