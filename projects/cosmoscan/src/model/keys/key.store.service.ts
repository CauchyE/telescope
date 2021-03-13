import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Key } from './key.model';
import Dexie from 'dexie';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class KeyStoreService {
  private db: Dexie;
  currentKey$: BehaviorSubject<Key | undefined>;

  constructor(private readonly key: KeyService) {
    const dbName = 'cosmoscan';
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
      current_keys: '++index, &id, key_id',
    });

    this.currentKey$ = new BehaviorSubject<Key | undefined>(undefined);

    this.init();
  }

  async init() {
    const currentKey: { key_id: string } = await this.db
      .table('current_keys')
      .get({ id: 'current_key' });
    if (!currentKey) {
      return;
    }

    const key = await this.key.get(currentKey.key_id);
    if (!key) {
      await this.db
        .table('current_keys')
        .where('id')
        .equals('current_key')
        .delete();
      return;
    }

    this.currentKey$.next(key);
  }

  async setCurrentKey(key: Key) {
    await this.db
      .table('current_keys')
      .put({ id: 'current_key', key_id: key.id });
    this.currentKey$.next(key);
  }

  resetCurrentKey() {
    this.currentKey$.next(undefined);
  }
}
