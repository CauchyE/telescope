import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest, websocket } from 'cosmos-client';
import { InlineResponse20031 } from 'cosmos-client/esm/openapi';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  initialBlock$?: Observable<InlineResponse20031 | undefined>;
  latestBlocks$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.initialBlock$ = this.cosmosSDK.sdk$.pipe(
      mergeMap(sdk => rest.cosmos.tendermint.getLatestBlock(sdk.rest).then((res) => res.data))
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

  ngOnInit(): void {
  }
}
