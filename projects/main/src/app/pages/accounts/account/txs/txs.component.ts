import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  address$: Observable<string | undefined>;
  txsWithPagination$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    const sdk$ = this.cosmosSDK.sdk$;
    this.txsWithPagination$ = combineLatest([sdk$, this.address$]).pipe(
      mergeMap(([sdk, address]) => {
        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.sender='${address}'`],
            undefined,
            undefined,
            undefined,
            true,
          )
          .then((res) => res.data)
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );
  }

  ngOnInit(): void {}
}
