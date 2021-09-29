import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Key } from './key.model';
import Dexie from 'dexie';
import { KeyService } from './key.service';
import { DbService } from '../db.service';

@Injectable({
  providedIn: 'root',
})
export class KeyStoreService {
  currentKey$: BehaviorSubject<Key | undefined>;
  private db: Dexie;

  constructor(private readonly key: KeyService, private readonly dbS: DbService) {
    this.currentKey$ = new BehaviorSubject<Key | undefined>(undefined);
    this.db = this.dbS.db;

    this.init();
  }

  async init() {
    try {
      const currentKey: { key_id: string } = await this.db.table('current_keys').get({ id: 'current_key' });
      if (!currentKey) {
        return;
      }

      const key = await this.key.get(currentKey.key_id);
      if (!key) {
        await this.db.table('current_keys').where('id').equals('current_key').delete();
        return;
      }

      this.currentKey$.next(key);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async setCurrentKey(key: Key) {
    try {
      await this.db.table('current_keys').where('id').equals('current_key').delete();
    } catch (error) {
      console.error(error);
    }
    try {
      await this.db.table('current_keys').put({ id: 'current_key', key_id: key.id });
      this.currentKey$.next(key);
    } catch (error) {
      console.error(error)
    }
  }

  resetCurrentKey() {
    this.currentKey$.next(undefined);
  }
}
