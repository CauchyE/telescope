import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { auth } from 'cosmos-client/x/auth';
import { TxQuery } from 'cosmos-client/api';
import { CosmosSDKService } from '@model/state.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  txHash$: Observable<string>;
  tx$: Observable<TxQuery>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
  ) {
    this.txHash$ = this.route.params.pipe(map((params) => params.tx_hash));
    this.tx$ = this.txHash$.pipe(
      mergeMap((hash) =>
        auth.txsHashGet(this.cosmosSDK.sdk, hash).then((res) => res.data),
      ),
    );
  }

  ngOnInit() { }
}
