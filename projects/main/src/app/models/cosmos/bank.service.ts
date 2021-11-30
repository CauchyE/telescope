import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(private readonly cosmosSDK: CosmosSDKService, private readonly key: KeyService) {}

  async send(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    privateKey: string,
  ): Promise<InlineResponse20075> {
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

    // build MsgSend
    const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress.toString(),
      to_address: toAddress,
      amount: amount,
    });

    // build TxBody
    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgSend)],
    });

    const dummyGasLimit = '1'; // This is dummy value for simulation.
    const dummyFee = '1'; // This is dummy value for simulation.

    // build AuthInfo for simulation
    const simulatedAuthInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
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
        amount: [
          {
            denom: 'ujcbn',
            amount: dummyFee,
          },
        ],
        gas_limit: cosmosclient.Long.fromString(dummyGasLimit),
      },
    });

    // sign simulation tx data
    const simulatedTxBuilder = new cosmosclient.TxBuilder(sdk, txBody, simulatedAuthInfo);
    const simulatedSignDocBytes = simulatedTxBuilder.signDocBytes(account.account_number);
    const simulatedSignature = privKey.sign(simulatedSignDocBytes);
    simulatedTxBuilder.addSignature(simulatedSignature);
    console.log('simulatedRequestTxJsonString', simulatedTxBuilder.cosmosJSONStringify());
    console.log('simulatedRequestTxJson', JSON.parse(simulatedTxBuilder.cosmosJSONStringify()));

    // restore json from txBuilder
    const requestBodyForSimulation = JSON.parse(simulatedTxBuilder.cosmosJSONStringify());
    delete requestBodyForSimulation.auth_info.signer_infos[0].mode_info.multi;
    requestBodyForSimulation.auth_info.fee.gas_limit = dummyGasLimit;

    // simulate tx
    const simulatedResult = await rest.tx.simulate(sdk, {
      tx: requestBodyForSimulation as any,
      tx_bytes: simulatedTxBuilder.txBytes(),
    });
    console.log('simulatedResult.data', simulatedResult.data);

    // estimate fee
    const simulatedGasUsed = simulatedResult.data.gas_info?.gas_used;
    // This margin prevents insufficient fee due to data size difference between simulated tx and actual tx.
    const simulatedGasUsedWithMarginNumber = simulatedGasUsed
      ? parseInt(simulatedGasUsed) * 1.1
      : 200000;
    const simulatedGasUsedWithMargin = simulatedGasUsedWithMarginNumber.toFixed(0);
    // Todo: 0.015 depends on Node's config(`~/.jpyx/config/app.toml` minimum-gas-prices).
    // Hardcode is not good.
    const simulatedFeeWithMarginNumber = parseInt(simulatedGasUsedWithMargin) * 0.015;
    const simulatedFeeWithMargin = Math.ceil(simulatedFeeWithMarginNumber).toFixed(0);
    console.log({
      simulatedGasUsed,
      simulatedGasUsedWithMargin,
      simulatedFeeWithMarginNumber,
      simulatedFeeWithMargin,
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
        amount: [
          {
            denom: 'ujcbn',
            amount: simulatedFeeWithMargin,
          },
        ],
        gas_limit: cosmosclient.Long.fromString(simulatedGasUsedWithMargin),
      },
    });

    // sign tx data
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(account.account_number);
    const signature = privKey.sign(signDocBytes);
    txBuilder.addSignature(signature);

    // broadcast tx
    const result = await rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.tx.BroadcastTxMode.Block,
    });

    // check broadcast tx error
    if (result.data.tx_response?.code !== 0) {
      throw Error(result.data.tx_response?.raw_log);
    }

    return result.data;
  }
}
