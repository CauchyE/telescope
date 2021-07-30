import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { websocket } from 'cosmos-client';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { first, map, scan } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  latestBlocks$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.cosmosSDK.websocketURL$.pipe(first()).subscribe((websocketURL) => {
      const ws = websocket.connect(websocketURL);
      ws.next({
        id: '1',
        jsonrpc: '2.0',
        method: 'subscribe',
        params: ["tm.event = 'NewBlock'"],
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
    //一時的にデバッグ用に追加
    this.latestBlocks$?.subscribe((latestBlocks) => {
      console.log('latestBlocks');
      console.log(latestBlocks);
    });
  }
}
