import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20031, InlineResponse20032 } from '@cosmos-client/core/esm/openapi';
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
  latestBlock$: Observable<InlineResponse20031 | undefined>;
  latestBlockHeight$ = new BehaviorSubject(BigInt(20));
  latestBlocks$: Observable<InlineResponse20032[] | undefined>;
  firstBlockHeight$ = new BehaviorSubject(BigInt(20));

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestBlock$ = sdk$.pipe(
      mergeMap((sdk) => rest.cosmos.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)),
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

    this.latestBlocks$ = combineLatest([this.firstBlockHeight$, this.pageSize$]).pipe(
      map(([firstBlockHeight, pageSize]) =>
        [...Array(pageSize).keys()].map((index) => {
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
                rest.cosmos.tendermint
                  .getBlockByHeight(sdk.rest, blockHeight)
                  .then((res) => res.data),
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
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
    const paginatedBlockHeight =
      this.latestBlockHeight$.getValue() - BigInt(pageEvent.pageIndex) * BigInt(pageEvent.pageSize);
    this.firstBlockHeight$.next(paginatedBlockHeight);
  }
}
