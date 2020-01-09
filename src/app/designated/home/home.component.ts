import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { Auth, SearchTxsResult, CosmosSDK, StdTx, TxResponse } from 'cosmos-client-ts/lib/';
import { mergeMap, map } from 'rxjs/operators';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-designated-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  forms: {
    url: string;
    chainID: string;
  };
  // txResponses$: Observable<TxResponse[]>;

  constructor(private state: StateService) {
    this.forms = {
      url: '',
      chainID: ''
    };
    // this.txResponses$ = timer(0, 60 * 1000).pipe(
    //   mergeMap(_ => this.state.value$),
    //   map(state => state.designatedHost!),
    //   map(host => new CosmosSDK(host.url, host.chainID)),
    //   mergeMap(sdk => Auth.getTransactions(sdk, {})),
    //   map(result => result.txs)
    // );
  }

  ngOnInit() { }

  ngOnDestroy() { }

  getMsgType(tx: StdTx) {
  }
}
