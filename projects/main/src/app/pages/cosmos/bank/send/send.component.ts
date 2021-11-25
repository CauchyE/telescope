import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { BankApplicationService } from '../../../../models/cosmos/bank.application.service';
import { Key } from '../../../../models/keys/key.model';
import { KeyService } from '../../../../models/keys/key.service';
import { KeyStoreService } from '../../../../models/keys/key.store.service';
import { SendOnSubmitEvent } from '../../../../views/cosmos/bank/send/send.component';
import { Component, OnInit } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  key$: Observable<Key | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  amounts$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly bankApplication: BankApplicationService,
  ) {
    this.key$ = this.keyStore.currentKey$;

    const address$ = this.key$.pipe(
      filter((key): key is Key => key !== undefined),
      map((key) =>
        cosmosclient.AccAddress.fromPublicKey(this.key.getPubKey(key!.type, key.public_key)),
      ),
    );

    this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );

    this.amounts$ = this.coins$.pipe(
      map((coin) =>
        coin?.map((data) => ({
          denom: data.denom,
          amount: '0',
        })),
      ),
    );
  }

  ngOnInit(): void {}

  async onSubmit($event: SendOnSubmitEvent) {
    await this.bankApplication.send($event.key, $event.toAddress, $event.amount, $event.privateKey);
  }
}
