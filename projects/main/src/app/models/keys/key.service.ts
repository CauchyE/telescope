import { KeyInfrastructureService } from './key.infrastructure.service';
import { Key, KeyType } from './key.model';
import { Injectable } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';

export interface IKeyInfrastructure {
  getPrivKey(type: KeyType, privateKey: Uint8Array): cosmosclient.PrivKey;
  getPubKey(type: KeyType, publicKey: string): cosmosclient.PubKey;
  sign(type: KeyType, privateKey: Uint8Array, message: Uint8Array): Uint8Array;
  getPrivateKeyFromMnemonic(mnemonic: string): Promise<string>;
  get(id: string): Promise<Key | undefined>;
  list(): Promise<Key[]>;
  set(id: string, type: KeyType, privateKey: Uint8Array): Promise<void>;
  delete(id: string): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  private readonly iKeyInfrastructure: IKeyInfrastructure;
  constructor(readonly keyInfrastructure: KeyInfrastructureService) {
    this.iKeyInfrastructure = keyInfrastructure;
  }

  getPrivKey(type: KeyType, privateKey: Uint8Array) {
    return this.iKeyInfrastructure.getPrivKey(type, privateKey);
  }

  getPubKey(type: KeyType, publicKey: string) {
    const publicKeyWithNoWhitespace = publicKey.replace(/\s+/g, '');
    return this.iKeyInfrastructure.getPubKey(type, publicKeyWithNoWhitespace);
  }

  sign(type: KeyType, privateKey: Uint8Array, message: Uint8Array) {
    return this.iKeyInfrastructure.sign(type, privateKey, message);
  }

  getPrivateKeyFromMnemonic(mnemonic: string) {
    const mnemonicWithNoWhitespace = mnemonic.trim();
    return this.iKeyInfrastructure.getPrivateKeyFromMnemonic(mnemonicWithNoWhitespace);
  }

  async validatePrivKey(key: Key, privateKey: Uint8Array) {
    const privKey = this.getPrivKey(key.type, privateKey);

    return key.public_key === Buffer.from(privKey.pubKey().bytes()).toString('hex');
  }

  get(id: string) {
    return this.iKeyInfrastructure.get(id);
  }

  list(): Promise<Key[]> {
    return this.iKeyInfrastructure.list();
  }

  set(id: string, type: KeyType, privateKey: Uint8Array) {
    return this.iKeyInfrastructure.set(id, type, privateKey);
  }

  delete(id: string) {
    return this.iKeyInfrastructure.delete(id);
  }
}
