import { ConfigService } from '../config.service';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { GentxData } from './gentx.model';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';

@Injectable({
  providedIn: 'root',
})
export class GentxService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly configS: ConfigService,
  ) {}

  async gentx(key: Key, gentxData: GentxData): Promise<{ [k: string]: any }> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, gentxData.privateKey);
    const pubKey = privKey.pubKey();
    const accAddress = cosmosclient.AccAddress.fromPublicKey(pubKey);
    const valAddress = cosmosclient.ValAddress.fromPublicKey(pubKey);

    if (gentxData.delegator_address !== accAddress.toString()) {
      throw Error('delegator_address mismatch!');
    }

    if (gentxData.validator_address !== valAddress.toString()) {
      throw Error('validator_address mismatch!');
    }

    console.log('gentxData.pubkey', gentxData.pubkey);
    const base64DecodedPublicKey = Uint8Array.from(Buffer.from(gentxData.pubkey, 'base64'));
    console.log('base64DecodedPublicKey', base64DecodedPublicKey);
    const publicKey = new proto.cosmos.crypto.ed25519.PubKey({
      key: base64DecodedPublicKey,
    });
    const packAnyPublicKey = cosmosclient.codec.packAny(publicKey);
    console.log('packAnyPublicKey', packAnyPublicKey);

    // build tx
    const createValidatorTxData = {
      description: {
        moniker: gentxData.moniker,
        identity: gentxData.identity,
        website: gentxData.website,
        security_contact: gentxData.security_contact,
        details: gentxData.details,
      },
      commission: {
        rate: gentxData.rate,
        max_rate: gentxData.max_rate,
        max_change_rate: gentxData.max_change_rate,
      },
      min_self_delegation: gentxData.min_self_delegation,
      delegator_address: gentxData.delegator_address,
      validator_address: gentxData.validator_address,
      pubkey: packAnyPublicKey,
      value: {
        denom: gentxData.denom,
        amount: gentxData.amount,
      },
    };
    console.log('createValidatorTxData', createValidatorTxData);
    const msgCreateValidator = new proto.cosmos.staking.v1beta1.MsgCreateValidator(
      createValidatorTxData,
    );
    console.log('msgCreateValidator', msgCreateValidator);

    const txBody = new proto.cosmos.tx.v1beta1.TxBody({
      messages: [cosmosclient.codec.packAny(msgCreateValidator)],
      memo: `${gentxData.node_id}@${gentxData.ip}:26656`,
      timeout_height: cosmosclient.Long.fromString('0'),
      extension_options: [],
      non_critical_extension_options: [],
    });
    console.log('txBody', txBody);

    const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
      signer_infos: [
        {
          public_key: cosmosclient.codec.packAny(pubKey),
          mode_info: {
            single: {
              mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
            },
          },
          sequence: cosmosclient.Long.fromString('0'),
        },
      ],
      fee: {
        amount: [],
        gas_limit: cosmosclient.Long.fromString('200000'),
        payer: '',
        granter: '',
      },
    });
    console.log('authInfo', authInfo);

    // sign
    const txBuilder = new cosmosclient.TxBuilder(sdk, txBody, authInfo);
    const signDocBytes = txBuilder.signDocBytes(cosmosclient.Long.fromString('0'));
    console.log('hex', Buffer.from(signDocBytes).toString('hex')); // ここのconsole.logを正規表現置換したものをデバッグ用にgentx-proto-binary.txtに書き出した
    txBuilder.addSignature(privKey.sign(signDocBytes));

    const txBodyJsonString = txBuilder.cosmosJSONStringify();
    console.log('txBodyJsonString', txBodyJsonString);
    const txBodyJson = JSON.parse(txBodyJsonString);
    console.log('txBodyJson', txBodyJson);
    const txRawJson = txBuilder.txRaw.toJSON();
    console.log('txRawJson', txRawJson);
    const signatures = txRawJson.signatures;
    console.log('signatures', signatures);
    const result = txBodyJson;
    console.log('result', result);
    return result;
  }

  downloadJsonFile(json: { [k: string]: any }, fileName: string): void {
    const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataString);
    downloadAnchorNode.setAttribute('download', fileName + '.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
