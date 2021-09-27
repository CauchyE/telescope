import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { InlineResponse20031, InlineResponse20032 } from 'cosmos-client/esm/openapi';
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
    // 考え方　
    // Observableな値。BehaviorSubject は値を流しやすい。
    this.latestBlock$.subscribe(
      (latestBlock) => {
        this.latestBlockHeight$.next(
          latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : BigInt(0)
        )
        this.firstBlockHeight$.next(
          latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : BigInt(0)
        )
        this.pageNumber$.next(0)
      }
    )

    this.latestBlocks$ = combineLatest([this.firstBlockHeight$, this.pageSize$]).pipe(
      map(([latestBlockHeight, pageSize]) =>
        [...Array(pageSize).keys()].map((index) => {
          const tempLatestBlockHeight = latestBlockHeight === undefined ? BigInt(0) : latestBlockHeight;
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
    /*
    this.cosmosSDK.websocketURL$.pipe(first()).subscribe((websocketURL) => {
      const ws = websocket.connect(websocketURL);
      ws.next({
        id: '1',
        jsonrpc: '2.0',
        method: 'subscribe',
        params: [`tm.event = 'NewBlock'`],
      });

      this.latestBlocks$ = ws.asObservable().pipe(
        scan<any>((all, current) => [current, ...all], []),
        map((data) => {
          data[0].result.data === undefined ? data.pop() : data;
          return data;
        }),
        map((data) => {
          data.length > 20 ? data.pop() : data;
          return data;
        }),
      );

      //暫定的に自動削除用のコードを無効化
      this.initialBlocks$ = initial;
      // websocket有効化後、自動削除を有効に
      this.initialBlocks$ = combineLatest([initial, this.latestBlocks$]).pipe(
        map(([init, latest]) => latest.length === 20 ? undefined : init)
      );
    });
    */
  }

  ngOnInit(): void {}

  appPagenationChanged(pageEvent: PageEvent): void {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageNumber$.next(pageEvent.pageIndex + 1);
    this.pageLength$.next(pageEvent.length);
    const pagenatedBlockHeight = this.latestBlockHeight$.getValue() - BigInt(pageEvent.pageIndex) * BigInt(pageEvent.pageSize);
    this.firstBlockHeight$.next(pagenatedBlockHeight);
  }
}
