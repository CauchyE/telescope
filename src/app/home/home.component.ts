import { Component, OnInit } from '@angular/core';
import { StateService } from '../../model/state.service';
import { Observable, timer } from 'rxjs';
import { CosmosSDK } from 'cosmos-client';
import { mergeMap, map } from 'rxjs/operators';
import { auth } from 'cosmos-client/x/auth';
import { PaginatedQueryTxs } from 'cosmos-client/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  txs$: Observable<PaginatedQueryTxs>;

  constructor(private state: StateService) {
    this.txs$ = timer(0, 60 * 1000).pipe(
      mergeMap((_) => this.state.value$),
      map((state) => state.designatedHost!),
      map((host) => new CosmosSDK(host.url, host.chainID)),
      mergeMap((sdk) => auth.txsGet(sdk)),
      map((res) => res.data),
    );
  }

  ngOnInit() {}
}
