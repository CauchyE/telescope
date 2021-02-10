import { Injectable } from '@angular/core';
import { CosmosSDKService } from '@model/cosmos-sdk.service';
import { Key } from '@model/keys/key.model';
import { KeyService } from '@model/keys/key.service';
import { AccAddress, ValAddress } from 'cosmos-client';
import { Coin } from 'cosmos-client/api';
import { auth } from 'cosmos-client/x/auth';
import { staking } from 'cosmos-client/x/staking';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
  ) {}

  async createDelegator(
    key: Key,
    validatorAddress: string,
    amount: Coin,
    privateKey: string,
  ) {
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const fromAddress = AccAddress.fromPublicKey(privKey.getPubKey());
    const account = await auth
      .accountsAddressGet(this.cosmosSDK.sdk, fromAddress)
      .then((res) => res.data.result);

    const valAddress_ = ValAddress.fromBech32(validatorAddress);

    const unsignedStdTx = await staking
      .delegatorsDelegatorAddrDelegationsPost(this.cosmosSDK.sdk, valAddress_, {
        delegator_address: fromAddress.toBech32(),
        validator_address: validatorAddress,
        delegation: amount,
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
