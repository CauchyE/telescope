import { Injectable } from '@angular/core';
import { cosmosclient } from 'cosmos-client';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import * as config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  restURL$: BehaviorSubject<string>;
  websocketURL$: BehaviorSubject<string>;
  chainID$: BehaviorSubject<string>;
  sdk$: Observable<{ rest: cosmosclient.CosmosSDK; websocket: cosmosclient.CosmosSDK }>;

  constructor() {
    if (
      config.bech32_prefix?.acc_addr &&
      config.bech32_prefix?.acc_pub &&
      config.bech32_prefix?.val_addr &&
      config.bech32_prefix?.val_addr &&
      config.bech32_prefix?.cons_addr &&
      config.bech32_prefix?.cons_addr
    ) {
      cosmosclient.config.bech32Prefix = {
        accAddr: config.bech32_prefix?.acc_addr,
        accPub: config.bech32_prefix?.acc_pub,
        valAddr: config.bech32_prefix?.val_addr,
        valPub: config.bech32_prefix?.val_addr,
        consAddr: config.bech32_prefix?.cons_addr,
        consPub: config.bech32_prefix?.cons_addr,
      };
    }

    this.restURL$ = new BehaviorSubject(`${location.protocol}//${location.hostname}:1317`);
    this.websocketURL$ = new BehaviorSubject(`${location.protocol.replace('http', 'ws')}://${location.hostname}:26657`);
    this.chainID$ = new BehaviorSubject('cosmoshub-3');
    this.sdk$ = combineLatest([this.restURL$, this.websocketURL$, this.chainID$]).pipe(
      map(([restURL, websocketURL, chainID]) => ({
        rest: new cosmosclient.CosmosSDK(restURL, chainID),
        websocket: new cosmosclient.CosmosSDK(websocketURL, chainID),
      })),
    );
  }

  sdk() {
    return this.sdk$.pipe(first()).toPromise();
  }
}
