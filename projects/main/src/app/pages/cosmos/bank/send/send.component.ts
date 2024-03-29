import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { BankApplicationService } from '../../../../models/cosmos/bank.application.service';
import { Key } from '../../../../models/keys/key.model';
import { KeyService } from '../../../../models/keys/key.service';
import { KeyStoreService } from '../../../../models/keys/key.store.service';
import { SendOnSubmitEvent } from '../../../../views/cosmos/bank/send/send.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  key$: Observable<Key | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  amount$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  minimumGasPrices: proto.cosmos.base.v1beta1.ICoin[];

  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly bankApplication: BankApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly configS: ConfigService,
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

    this.amount$ = this.coins$.pipe(
      map((amount) =>
        amount?.map((coin) => ({
          denom: coin.denom,
          amount: '0',
        })),
      ),
    );

    this.minimumGasPrices = this.configS.config.minimumGasPrices;
  }

  ngOnInit(): void {}

  async onSubmit($event: SendOnSubmitEvent) {
    if ($event.amount.length === 0) {
      this.snackBar.open('Invalid coins', undefined, {
        duration: 6000,
      });
      return;
    }
    await this.bankApplication.send(
      $event.key,
      $event.toAddress,
      $event.amount,
      $event.minimumGasPrice,
      $event.privateKey,
      $event.coins,
    );
  }
}
