import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { CreateValidatorData } from './staking.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
  ) {}

  async createValidator(
    key: Key,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const txBuilder = await this.buildCreateValidator(key, createValidatorData, gas, fee, false);
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToCreateValidator(
    key: Key,
    createValidatorData: CreateValidatorData,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildCreateValidator(
      key,
      createValidatorData,
      dummyGas,
      dummyFee,
      true,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice);
  }

  async buildCreateValidator(
    key: Key,
    createValidatorData: CreateValidatorData,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    isSimulation: boolean,
  ): Promise<cosmosclient.TxBuilder> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, createValidatorData.privateKey);
    const pubKey = privKey.pubKey();
    const accAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, accAddress)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    if (createValidatorData.delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (createValidatorData.validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    const base64DecodedPublicKey = Uint8Array.from(
      Buffer.from(createValidatorData.pubkey, 'base64'),
    );
    const publicKey = new proto.cosmos.crypto.ed25519.PubKey({
      key: base64DecodedPublicKey,
    });
    const packAnyPublicKey = cosmosclient.codec.packAny(publicKey);

    // build tx
    const createValidatorTxData = {
      description: {
        moniker: createValidatorData.moniker,
        identity: createValidatorData.identity,
        website: createValidatorData.website,
        security_contact: createValidatorData.security_contact,
        details: createValidatorData.details,
      },
      commission: {
        rate: isSimulation
          ? (parseInt(createValidatorData.rate) / 100).toFixed(2)
          : createValidatorData.rate,
        max_rate: isSimulation
          ? (parseInt(createValidatorData.max_rate) / 100).toFixed(2)
          : createValidatorData.max_rate,
        max_change_rate: isSimulation
          ? (parseInt(createValidatorData.max_change_rate) / 100).toFixed(2)
          : createValidatorData.max_change_rate,
      },
      min_self_delegation: createValidatorData.min_self_delegation,
      delegator_address: createValidatorData.delegator_address,
      validator_address: createValidatorData.validator_address,
      pubkey: packAnyPublicKey,
      value: {
        denom: createValidatorData.denom,
        amount: createValidatorData.amount,
      },
    };
    const msgCreateValidator = new proto.cosmos.staking.v1beta1.MsgCreateValidator(
      createValidatorTxData,
    );

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgCreateValidator)],
      memo: `${createValidatorData.node_id}@${createValidatorData.ip}:26656`,
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
          sequence: account.sequence,
        },
      ],
      fee: {
        amount: [fee],
        gas_limit: cosmosclient.Long.fromString(gas.amount ? gas.amount : '200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(account.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    return txBuilder;
  }

  async createDelegator(
    key: Key,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    privateKey: string,
  ) {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);

    // get account info
    const account = await rest.auth
      .account(sdk, fromAddress)
      .then(
        (res) =>
          res.data.account &&
          (cosmosclient.codec.unpackCosmosAny(
            res.data.account,
          ) as proto.cosmos.auth.v1beta1.BaseAccount),
      )
      .catch((_) => undefined);

    if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      throw Error('Address not found');
    }

    // build tx
    const msgDelegate = new proto.cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: fromAddress.toString(),
      validator_address: validatorAddress,
      amount,
    });

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgDelegate)],
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
          sequence: account.sequence,
        },
      ],
      fee: {
        gas_limit: cosmosclient.Long.fromString('200000'),
      },
    });

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(account.account_number);
    txBuilder.addSignature(privKey.sign(signDocBytes));

    // broadcast
    const result = await rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.tx.BroadcastTxMode.Block,
    });

    return result.data.tx_response?.txhash || '';
  }
}
