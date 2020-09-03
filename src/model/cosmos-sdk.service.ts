import { Injectable } from '@angular/core';
import { CosmosSDK, Address } from 'cosmos-client';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  sdk: CosmosSDK;

  constructor() {
    this.sdk = new CosmosSDK(environment.url, environment.chain_id);
    console.log('environments', environment);
    if (
      environment.bech32_prefix?.acc_addr &&
      environment.bech32_prefix?.acc_pub &&
      environment.bech32_prefix?.val_addr &&
      environment.bech32_prefix?.val_addr &&
      environment.bech32_prefix?.cons_addr &&
      environment.bech32_prefix?.cons_addr
    ) {
      Address.setBech32Prefix(
        environment.bech32_prefix.acc_addr,
        environment.bech32_prefix.acc_pub,
        environment.bech32_prefix.val_addr,
        environment.bech32_prefix.val_addr,
        environment.bech32_prefix.cons_addr,
        environment.bech32_prefix.cons_addr,
      );
    }
  }
}
