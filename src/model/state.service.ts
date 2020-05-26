import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CosmosSDK } from 'cosmos-client';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  sdk: CosmosSDK;

  constructor() {
    this.sdk = new CosmosSDK('https://gaia.lcnem.net', 'cosmoshub-3');
  }

  update(url: string, chainID: string) {
    this.sdk = new CosmosSDK(url, chainID);
  }
}
