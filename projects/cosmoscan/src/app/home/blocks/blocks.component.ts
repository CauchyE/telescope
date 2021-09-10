import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { InlineResponse20031, InlineResponse20032 } from 'cosmos-client/esm/openapi';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { Observable, of, zip, timer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pollingInterval = 30;
  latestBlock$: Observable<InlineResponse20031 | undefined>;
  latestBlockHeight$: Observable<bigint | undefined>;
  latestBlocks$: Observable<InlineResponse20032[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    // eslint-disable-next-line no-unused-vars
    const sdk$ = timer$.pipe(mergeMap(_ => this.cosmosSDK.sdk$));
    this.latestBlock$ = sdk$.pipe(
      mergeMap(sdk => rest.cosmos.tendermint.getLatestBlock(sdk.rest).then((res) => res.data))
    );
    this.latestBlockHeight$ = this.latestBlock$.pipe(
      // eslint-disable-next-line no-undef
      map(latestBlock => latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : undefined),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      })
    );
    this.latestBlocks$ = this.latestBlockHeight$.pipe(
      map(
        (latestBlockHeight) => [...Array(20).keys()].map(
          (index) => {
            if (latestBlockHeight === undefined) {
              throw Error('latestBlockHeight should not be undfined!');
            }
            // eslint-disable-next-line no-undef
            return latestBlockHeight - BigInt(index);
          }
        )
      ),
      mergeMap(
        (blockHeights) => zip(...blockHeights.map(
            (blockHeight) => this.cosmosSDK.sdk$.pipe(
                mergeMap(sdk => rest.cosmos.tendermint.getBlockByHeight(sdk.rest, blockHeight).then((res) => res.data))
              )
          ))
      ),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      })
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
}
