import { Component, OnInit } from '@angular/core';
import { SendOnSubmitEvent } from '@view/keys/key/send/send.component';
import { Observable, from, of } from 'rxjs';
import { Key, KeyType } from '@model/keys/key.model';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, filter, tap } from 'rxjs/operators';
import {
  KeyService,
  KeyApplicationService,
  CosmosSDKService,
} from '@model/index';
import { Coin } from 'cosmos-client/api';
import {
  AccAddress,
  PubKeySecp256k1,
  PubKeyEd25519,
  PubKey,
} from 'cosmos-client';
import { PubKeySr25519 } from 'cosmos-client/tendermint/types/sr25519';
import { auth, BaseAccount } from 'cosmos-client/x/auth';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;
  coins$: Observable<Coin[] | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly keyApplication: KeyApplicationService,
  ) {
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));

    const address$ = this.key$.pipe(
      filter((key): key is Key => key !== undefined),
      map((key) => AccAddress.fromPublicKey(this.getPublicKey(key))),
    );

    this.coins$ = address$.pipe(
      mergeMap((address) =>
        auth.accountsAddressGet(this.cosmosSDK.sdk, address),
      ),
      map((result) => result.data.result.coins),
    );
  }

  private getPublicKey(key: Key): PubKey {
    const publicKeyBuffer = Buffer.from(key.public_key, 'base64');
    switch (key.type) {
      case KeyType.SECP256K1:
        return new PubKeySecp256k1(publicKeyBuffer);
      case KeyType.ED25519:
        return new PubKeyEd25519(publicKeyBuffer);
      case KeyType.SR25519:
        return new PubKeySr25519(publicKeyBuffer);
    }
  }
  ngOnInit(): void {}

  async onSubmit($event: SendOnSubmitEvent) {
    await this.keyApplication.send(
      $event.key,
      $event.toAddress,
      $event.amount,
      $event.privateKey,
    );
  }
}
