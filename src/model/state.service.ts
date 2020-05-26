import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CosmosSDK } from 'cosmos-client';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  sdk: CosmosSDK;

  constructor() {
    this.sdk = new CosmosSDK('https://gaia.lcnem.com', 'cosmoshub-3');
  }
}
