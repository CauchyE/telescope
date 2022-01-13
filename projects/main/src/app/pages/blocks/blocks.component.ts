import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { Observable, of, zip, timer, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pageSizeOptions = [5, 10, 20];
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  pageLength$: BehaviorSubject<number> = new BehaviorSubject(1000);

  pollingInterval = 30;
  latestBlock$: Observable<InlineResponse20035 | undefined>;
  latestBlockHeight$ = new BehaviorSubject(BigInt(20));
  latestBlocks$: Observable<InlineResponse20036[] | undefined>;
  firstBlockHeight$ = new BehaviorSubject(BigInt(20));

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

    this.latestBlock$.subscribe((latestBlock) => {
      this.latestBlockHeight$.next(
        latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : BigInt(0),
      );
      this.firstBlockHeight$.next(
        latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : BigInt(0),
      );
      this.pageLength$.next(
        latestBlock?.block?.header?.height ? parseInt(latestBlock.block.header.height) : 0,
      );
      this.pageNumber$.next(0);
    });

    //add
    this.route.queryParams.subscribe((params) => {
      console.log('pages', params); // { order: "popular" }
      console.log(this.pageSizeOptions.includes(Number(params.perPage)));

      if (this.pageSizeOptions.includes(Number(params.perPage))) {
        console.log('inclide', params.perPage);
        this.pageSize$.next(params.perPage);
      }
      this.pageNumber$.next(params.pages);
      console.log(this.pageSize$.getValue(), this.pageNumber$.getValue());

      const paginatedBlockHeight =
        this.latestBlockHeight$.getValue() - BigInt(params.pages - 1) * BigInt(params.perPage) > 0
          ? this.latestBlockHeight$.getValue() - BigInt(params.pages - 1) * BigInt(params.perPage)
          : BigInt(100);
      console.log('paginatedBlockHeight', paginatedBlockHeight);

      this.firstBlockHeight$.next(paginatedBlockHeight);
    });

    this.latestBlocks$ = combineLatest([this.firstBlockHeight$, this.pageSize$]).pipe(
      map(([firstBlockHeight, pageSize]) =>
        [...Array(pageSize * 1).keys()].map((index) => {
          console.log('index', index);
          const tempLatestBlockHeight =
            firstBlockHeight === undefined ? BigInt(0) : firstBlockHeight;
          return tempLatestBlockHeight - BigInt(index);
        }),
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

    this.pageSize$.subscribe((x) => console.log('pageSize', x));
    this.firstBlockHeight$.subscribe((x) => console.log('1stBlockH', x));
  }

  ngOnInit(): void {}

  appPaginationChanged(pageEvent: PageEvent): void {
    /*
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
    const paginatedBlockHeight =
      this.latestBlockHeight$.getValue() - BigInt(pageEvent.pageIndex) * BigInt(pageEvent.pageSize);
    this.firstBlockHeight$.next(paginatedBlockHeight);
    */

    //add
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
