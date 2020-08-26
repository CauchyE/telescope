import { Injectable } from '@angular/core';
import { CosmosSDK, Address } from 'cosmos-client';
import * as config from 'src/config.json';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  sdk: CosmosSDK;

  constructor() {
    this.sdk = new CosmosSDK(config.url, config.chain_id);
    if (
      config.bech32_prefix?.acc_addr &&
      config.bech32_prefix?.acc_pub &&
      config.bech32_prefix?.val_addr &&
      config.bech32_prefix?.val_addr &&
      config.bech32_prefix?.cons_addr &&
      config.bech32_prefix?.cons_addr
    ) {
      Address.setBech32Prefix(
        config.bech32_prefix?.acc_addr,
        config.bech32_prefix?.acc_pub,
        config.bech32_prefix?.val_addr,
        config.bech32_prefix?.val_addr,
        config.bech32_prefix?.cons_addr,
        config.bech32_prefix?.cons_addr,
      );
    }
  }
}
