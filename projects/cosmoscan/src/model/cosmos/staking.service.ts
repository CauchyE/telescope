import { Injectable } from '@angular/core';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { cosmosclient, rest, cosmos } from 'cosmos-client';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
  ) { }

  async createDelegator(
    key: Key,
    validatorAddress: string,
    amount: cosmos.base.v1beta1.ICoin,
    privateKey: string,
  ) {
    const sdk = await this.cosmosSDK.sdk().then(sdk => sdk.rest)
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.cosmos.auth
      .account(sdk, fromAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackAny(res.data.account) as cosmos.auth.v1beta1.IBaseAccount)
      .catch((_) => undefined);

    if (!account) {
      throw Error('Address not found')
    }

    // build tx
    const msgDelegate = new cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: fromAddress.toString(),
      validator_address: validatorAddress,
      amount: amount,
    });

    const txBody = new cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDelegate)],
    });
    const authInfo = new cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: account.sequence,
        },
      ],
      fee: {
        gas_limit: cosmosclient.Long.fromString('200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDoc = txBuilder.signDoc(account.account_number!);
    txBuilder.addSignature(privKey, signDoc);

    // broadcast
    const result = await rest.cosmos.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.cosmos.tx.BroadcastTxMode.Block,
    });

    return result.data.tx_response?.txhash || '';
  }
}
