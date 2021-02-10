import { Injectable } from '@angular/core';
import { Coin } from 'cosmos-client/api';
import { auth } from 'cosmos-client/x/auth';
import { bank } from 'cosmos-client/x/bank';
import { AccAddress } from 'cosmos-client';
import { CosmosSDKService } from '@model/cosmos-sdk.service';
import { Key } from '@model/keys/key.model';
import { KeyService } from '@model/keys/key.service';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
  ) {}

  async send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    const privKey = this.key.getPrivKey(key.type, privateKey);
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

    return result.txhash || '';
  }
}
