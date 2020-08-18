import { Injectable } from '@angular/core';
import { Key, KeyType } from './key.model';
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

  private getPrivKey(type: KeyType, privateKey: string) {
    const privKeyBuffer = Buffer.from(privateKey, 'base64');
    switch (type) {
      case KeyType.SECP256K1:
        return new PrivKeySecp256k1(privKeyBuffer);
      case KeyType.ED25519:
        return new PrivKeyEd25519(privKeyBuffer);
      case KeyType.SR25519:
        return new PrivKeySr25519(privKeyBuffer);
    }
  }

  async getPrivateKeyFromMnemonic(mnemonic: string) {
    return (
      await this.cosmosSDK.sdk.generatePrivKeyFromMnemonic(mnemonic)
    ).toString('base64');
  }

  /**
   * Get one from Indexed DB
   * @param id
   */
  async get(id: string) {}

  /**
   * Get all from Indexed DB
   */
  async keys() {}

  /**
   * Set with id in Indexed DB
   * @param id
   * @param type
   * @param privateKey
   */
  async set(id: string, type: KeyType, privateKey: string) {
    const privKey = this.getPrivKey(type, privateKey);
    const publicKey = privKey.getPubKey().toBase64();

    const data: Key = {
      id,
      type,
      public_key: publicKey,
    };
  }

  /**
   * Delete with id from Indexed DB
   * @param id
   */
  async delete(id: string) {}

  async send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    const privKey = this.getPrivKey(key.type, privateKey);
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
