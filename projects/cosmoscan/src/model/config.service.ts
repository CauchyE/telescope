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
    navigations: {
      name: string;
      link: string;
    }[];
    messageActions: string[];
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
