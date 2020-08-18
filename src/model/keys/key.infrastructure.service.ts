import { Injectable } from '@angular/core';
import { Key } from './key.model';
import { Coin } from 'cosmos-client/api';
import { IKeyInfrastructure } from './key.service';
import { auth } from 'cosmos-client/x/auth';
import { bank } from 'cosmos-client/x/bank';
import { PrivKeySecp256k1, PrivKeyEd25519, AccAddress } from 'cosmos-client';
import { PrivKeySr25519 } from 'cosmos-client/tendermint/types/sr25519';
import { CosmosSDKService } from '@model/cosmos-sdk.service';

@Injectable({
  providedIn: 'root',
})
export class KeyInfrastructureService implements IKeyInfrastructure {
  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  async get(id: string) {}

  async keys() {}

  async set(id: string, data: Key) {}

  async send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    const privKeyBuffer = Buffer.from(privateKey, 'hex');
    const privKey = (() => {
      switch (key.type) {
        case 'secp256k1':
          return new PrivKeySecp256k1(privKeyBuffer);
        case 'ed25519':
          return new PrivKeyEd25519(privKeyBuffer);
        case 'sr25519':
          return new PrivKeySr25519(privKeyBuffer);
      }
    })();
    const fromAddress = AccAddress.fromPublicKey(privKey.getPubKey());
    const account = await auth
      .accountsAddressGet(this.cosmosSDK.sdk, fromAddress)
      .then((res) => res.data.result);

    const toAddress_ = AccAddress.fromBech32(toAddress);

    const unsignedStdTx = await bank
      .accountsAddressTransfersPost(this.cosmosSDK.sdk, toAddress_, {
        base_req: {
          from: fromAddress.toBech32(),
          memo: '',
          chain_id: this.cosmosSDK.sdk.chainID,
          account_number: account.account_number.toString(),
          sequence: account.sequence.toString(),
          gas: '',
          gas_adjustment: '',
          fees: [],
          simulate: false,
        },
        amount: amount,
      })
      .then((res) => res.data);

    const signedStdTx = auth.signStdTx(
      this.cosmosSDK.sdk,
      privKey,
      unsignedStdTx,
      account.account_number.toString(),
      account.sequence.toString(),
    );

    const result = await auth
      .txsPost(this.cosmosSDK.sdk, signedStdTx, 'block')
      .then((res) => res.data);
  }
}
