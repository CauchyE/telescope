import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { auth } from 'cosmos-client/x/auth';
import { PaginatedQueryTxs } from 'cosmos-client/api';
import { CosmosSDKService } from '@model/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  txs$: Observable<PaginatedQueryTxs>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.txs$ = timer(0, 60 * 1000).pipe(
      mergeMap((_) => auth.txsGet(this.cosmosSDK.sdk).then((res) => res.data)),
    );
  }

  ngOnInit() {}
}
