import { Injectable } from '@angular/core';
import { Coin } from 'cosmos-client/api';
import { Key } from './key.model';
import { KeyInfrastructureService } from './key.infrastructure.service';

export interface IKeyInfrastructure {
  getPrivateKeyFromMnemonic(mnemonic: string): Promise<string>;
  get(id: string): Promise<Key>;
  keys(): Promise<Key[]>;
  set(id: string, type: KeyType, privateKey: string): Promise<void>;
  delete(id: string): Promise<void>;
  send(
    key: Key,
    toAddress: string,
    amount: Coin[],
    privateKey: string,
  ): Promise<void>;
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

  send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    this.iKeyInfrastructure.send(key, toAddress, amount, privateKey);
  }
}
