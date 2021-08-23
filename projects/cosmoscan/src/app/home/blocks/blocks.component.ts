import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest, websocket } from 'cosmos-client';
import { InlineResponse20031 } from 'cosmos-client/esm/openapi';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { first, map, mergeMap, scan } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  initialBlocks$?: Observable<InlineResponse20031 | undefined>;
  latestBlocks$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const initial = this.cosmosSDK.sdk$.pipe(
      mergeMap(sdk => rest.cosmos.tendermint.getLatestBlock(sdk.rest).then((res) => res.data))
    );

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

      this.initialBlocks$ = combineLatest([initial, this.latestBlocks$]).pipe(
        map(([init, latest]) => latest.length === 20 ? undefined : init)
      );
    });
  }

  ngOnInit(): void {
  }
}