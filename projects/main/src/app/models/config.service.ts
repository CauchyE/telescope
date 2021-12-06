import { Injectable } from '@angular/core';

export type Config = {
  restURL: string;
  websocketURL: string;
  chainID: string;
  bech32Prefix?: {
    accAddr: string;
    accPub: string;
    valAddr: string;
    valPub: string;
    consAddr: string;
    consPub: string;
  };
  minimumGasPrices: {
    denom: string;
    amount: string;
  }[];
  extension?: {
    faucet?: {
      hasFaucet: boolean;
      faucetURL: string;
      denom: string;
      creditAmount: number;
      maxCredit: number;
    }[];
    monitor?: {
      monitorURL: string;
    };
    navigations: {
      name: string;
      link: string;
      icon: string;
    }[];
    messageModules: string[];
  };
};

declare const config: Config;

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config: Config;
  constructor() {
    this.config = config;
  }
}
