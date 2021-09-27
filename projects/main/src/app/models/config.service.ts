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
  extension?: {
    faucet: boolean;
    monitor?: {
      monitorURL: string;
    };
    navigations: {
      name: string;
      link: string;
    }[];
    messageActions: string[];
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
