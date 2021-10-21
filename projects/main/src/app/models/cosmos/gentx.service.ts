import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';

@Injectable({
  providedIn: 'root',
})
export class GentxService {
  constructor(private readonly cosmosSDK: CosmosSDKService, private readonly key: KeyService) {}

  async gentx(
    key: Key,
    privateKey: string,
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    max_rate: string,
    max_change_rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
  ): Promise<void> {
    // Todo: void should be changed.
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const accAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(pubKey);

    if (delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    // build tx
    const msgCreateValidator = new proto.cosmos.staking.v1beta1.MsgCreateValidator({
      description: {
        moniker,
        identity,
        website,
        security_contact,
        details,
      },
      commission: {
        rate,
        max_rate,
        max_change_rate,
      },
      min_self_delegation,
      delegator_address,
      validator_address,
      pubkey: cosmosclient.codec.packAny(pubKey),
      value: {
        denom,
        amount,
      },
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgCreateValidator)],
    });

    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: cosmosclient.Long.fromString('0'), // Todo: Is this OK?
        },
      ],
      fee: {
        gas_limit: cosmosclient.Long.fromString('200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(cosmosclient.Long('0')); // Todo: Is this OK?
    txBuilder.addSignature(privKey.sign(signDocBytes));

    // Todo: WIP
  }
}
