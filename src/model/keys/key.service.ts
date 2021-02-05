import { Injectable } from '@angular/core';
import { Coin } from 'cosmos-client/api';
import { Key, KeyType } from './key.model';
import { KeyInfrastructureService } from './key.infrastructure.service';

export interface IKeyInfrastructure {
  getPrivateKeyFromMnemonic(mnemonic: string): Promise<string>;
  get(id: string): Promise<Key | undefined>;
  list(): Promise<Key[]>;
  set(id: string, type: KeyType, privateKey: string): Promise<void>;
  delete(id: string): Promise<void>;
  send(
    key: Key,
    toAddress: string,
    amount: Coin[],
    privateKey: string,
  ): Promise<string>;
}

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  private readonly iKeyInfrastructure: IKeyInfrastructure;
  constructor(readonly keyInfrastructure: KeyInfrastructureService) {
    this.iKeyInfrastructure = keyInfrastructure;
  }
  getPrivateKeyFromMnemonic(mnemonic: string) {
    return this.iKeyInfrastructure.getPrivateKeyFromMnemonic(mnemonic);
  }

  get(id: string) {
    return this.iKeyInfrastructure.get(id);
  }

  list(): Promise<Key[]> {
    return this.iKeyInfrastructure.list();
  }

  set(id: string, type: KeyType, privateKey: string) {
    return this.iKeyInfrastructure.set(id, type, privateKey);
  }

  delete(id: string) {
    return this.iKeyInfrastructure.delete(id);
  }

  send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    return this.iKeyInfrastructure.send(key, toAddress, amount, privateKey);
  }
}
