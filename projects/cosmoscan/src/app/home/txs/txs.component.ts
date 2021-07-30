import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { websocket } from 'cosmos-client';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { first, map, scan } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css']
})
export class TxsComponent implements OnInit {
  latestTxs$?: Observable<websocket.RequestSchema[] | websocket.ResponseSchema[]>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.cosmosSDK.websocketURL$.pipe(first()).subscribe((websocketURL) => {
      const ws = websocket.connect(websocketURL);
      ws.next({
        id: '1',
        jsonrpc: '2.0',
        method: 'subscribe',
        params: ["tm.event = 'Tx'"],
      });
      this.latestTxs$ = ws.asObservable().pipe(
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
    this.latestTxs$?.subscribe((latestTxs) => {
      console.log('latestTxs');
      console.log(latestTxs);
    });
  }
}
