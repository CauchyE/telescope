import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Key, KeyType } from './key.model';
import { Coin } from 'cosmos-client/api';
import { IKeyInfrastructure } from './key.service';
import { auth } from 'cosmos-client/x/auth';
import { bank } from 'cosmos-client/x/bank';
import {
  PrivKeySecp256k1,
  PrivKeyEd25519,
  AccAddress,
  PrivKeySr25519,
} from 'cosmos-client';
import { CosmosSDKService } from '@model/cosmos-sdk.service';

@Injectable({
  providedIn: 'root',
})
export class KeyInfrastructureService implements IKeyInfrastructure {
  private db: Dexie;

  constructor(private readonly cosmosSDK: CosmosSDKService) {
    const dbName = 'cosmoscan';
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
      keys: '++index, &id, type, public_key',
    });
  }

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
  async get(id: string): Promise<Key | undefined> {
    try {
      const data = await this.db.table('keys').get({ id });
      if (data !== undefined) {
        return {
          id: data.id,
          type: data.type,
          public_key: data.public_key,
        };
      }
    } catch (error) {
      console.error(error);
    }
    return undefined;
  }

  /**
   * Get all from Indexed DB
   */
  async list(): Promise<Key[]> {
    return (await this.db.table('keys').toArray()).map((data) => ({
      id: data.id,
      type: data.type,
      public_key: data.public_key,
    }));
  }

  /**
   * Set with id in Indexed DB
   * @param id
   * @param type
   * @param privateKey
   */
  async set(id: string, type: KeyType, privateKey: string) {
    const key = await this.get(id);
    if (key !== undefined) {
      throw new Error('Already exists');
    }

    const privKey = this.getPrivKey(type, privateKey);
    const publicKey = privKey.getPubKey().toBase64();

    const data: Key = {
      id,
      type,
      public_key: publicKey,
    };
    await this.db.table('keys').put(data);
  }

  /**
   * Delete with id from Indexed DB
   * @param id
   */
  async delete(id: string) {
    await this.db.table('keys').where('id').equals(id).delete();
  }

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

    return result.txhash || '';
  }
}
