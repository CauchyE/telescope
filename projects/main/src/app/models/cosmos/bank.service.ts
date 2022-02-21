import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
  ) { }

  async send(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildSendTx(key, toAddress, amount, gas, fee, privateKey);
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToSend(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildSendTx(
      key,
      toAddress,
      amount,
      dummyGas,
      dummyFee,
      privateKey,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice);
  }

  async buildSendTx(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    // remove unintentional whitespace
    const toAddressWithNoWhitespace = toAddress.replace(/\s+/g, '');

    // build MsgSend
    const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress.toString(),
      to_address: toAddressWithNoWhitespace,
      amount: amount,
    });

    // build TxBody
    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgSend)],
    });

    // build AuthInfo
    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign tx data
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(account.account_number);
    const signature = privKey.sign(signDocBytes);
    txBuilder.addSignature(signature);

    return txBuilder;
  }
}
