import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db: Dexie;

  constructor() {
    const dbName = 'telescope';
    this.db = new Dexie(dbName);
    this.db.version(1).stores({
      keys: '++index, &id, type, public_key',
      current_keys: '++index, &id, key_id',
    });
  }
}
