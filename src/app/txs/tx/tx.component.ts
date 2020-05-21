import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { CosmosSDK } from 'cosmos-client';
import { auth } from 'cosmos-client/x/auth';
import { StateService } from '../../../model/state.service';
import { TxQuery } from 'cosmos-client/api';

@Component({
  selector: 'app-transaction',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  hash$: Observable<string>;
  tx$: Observable<TxQuery>;

  constructor(private route: ActivatedRoute, private state: StateService) {
    this.hash$ = this.route.params.pipe(map((params) => params['hash']));
    this.tx$ = this.hash$.pipe(
      mergeMap((hash) =>
        this.state.value$.pipe(
          map((state) => state.designatedHost!),
          map((host) => new CosmosSDK(host.url, host.chainID)),
          mergeMap((sdk) => auth.txsHashGet(sdk, hash)),
          map((res) => res.data),
        ),
      ),
    );
  }

  ngOnInit() {}
}
