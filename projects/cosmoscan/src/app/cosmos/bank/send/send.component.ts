import { Component, OnInit } from '@angular/core';
import { SendOnSubmitEvent } from '../../../../view/cosmos/bank/send/send.component';
import { combineLatest, Observable } from 'rxjs';
import { Key } from '../../../../model/keys/key.model';
import { map, mergeMap, filter, tap } from 'rxjs/operators';
import { CosmosSDKService } from '../../../../model/cosmos-sdk.service';
import { cosmosclient, proto, rest } from 'cosmos-client';
import { KeyStoreService } from '../../../../model/keys/key.store.service';
import { BankApplicationService } from '../../../../model/cosmos/bank.application.service';
import { KeyService } from '../../../../model/keys/key.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  key$: Observable<Key | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly bankApplication: BankApplicationService,
  ) {
    this.key$ = this.keyStore.currentKey$;

    const address$ = this.key$.pipe(
      filter((key): key is Key => key !== undefined),
      map((key) => cosmosclient.AccAddress.fromPublicKey(this.key.getPubKey(key!.type, key.public_key))),
    );

    this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.cosmos.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );
  }

  ngOnInit(): void { }

  async onSubmit($event: SendOnSubmitEvent) {
    await this.bankApplication.send($event.key, $event.toAddress, $event.amount, $event.privateKey);
  }
}
