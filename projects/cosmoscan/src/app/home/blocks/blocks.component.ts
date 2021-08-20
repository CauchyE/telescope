import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest, websocket } from 'cosmos-client';
import { InlineResponse20031 } from 'cosmos-client/esm/openapi';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { first, map, mergeMap, scan } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  initialBlocks$?: Observable<InlineResponse20031>;
  latestBlocks$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const initial = this.cosmosSDK.sdk$.pipe(
      mergeMap(sdk => rest.cosmos.tendermint.getLatestBlock(sdk.rest).then((res) => res.data))
    );

    //暫定的に最新1つを表示
    this.initialBlocks$ = initial;

    //for (let i = 0; i < 20; i++) {
      //this.initialBlocks$ = this.cosmosSDK.sdk$.pipe(
        //mergeMap(sdk => rest.cosmos.tendermint.getBlockByHeight(sdk.rest, BigInt(2650) - BigInt(i)).then((res) => res.data)),
        //scan<any>((all, current) => [current, ...all], []),
      //);
    //}

    this.cosmosSDK.websocketURL$.pipe(first()).subscribe((websocketURL) => {
      const ws = websocket.connect(websocketURL);
      ws.next({
        id: '1',
        jsonrpc: '2.0',
        method: 'subscribe',
        params: ['tm.event = "NewBlock"'],
      });
      this.latestBlocks$ = ws.asObservable().pipe(
        scan<any>((all, current) => [current, ...all], []),
        map((data) => {
          if (data[0].result.data === undefined) {
            data.pop();
          }
          return data;
        }),
        map((data) => {
          if (data.length > 20) {
            data.pop();
          }
          return data;
        }),
      );
    });
  }

  ngOnInit(): void {
    this.initialBlocks$?.subscribe((initialBlocks) => {
      //一時的にデバッグ用に追加
      console.log('initialBlocks');
      console.log(initialBlocks);
    });
  }
}
