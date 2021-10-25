import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  restURL$: BehaviorSubject<string>;
  websocketURL$: BehaviorSubject<string>;
  chainID$: BehaviorSubject<string>;
  sdk$: Observable<{ rest: cosmosclient.CosmosSDK; websocket: cosmosclient.CosmosSDK }>;

  constructor(private readonly config: ConfigService) {
    if (
      this.config.config.bech32Prefix?.accAddr &&
      this.config.config.bech32Prefix?.accPub &&
      this.config.config.bech32Prefix?.valAddr &&
      this.config.config.bech32Prefix?.valAddr &&
      this.config.config.bech32Prefix?.consAddr &&
      this.config.config.bech32Prefix?.consAddr
    ) {
      cosmosclient.config.setBech32Prefix({
        accAddr: this.config.config.bech32Prefix?.accAddr,
        accPub: this.config.config.bech32Prefix?.accPub,
        valAddr: this.config.config.bech32Prefix?.valAddr,
        valPub: this.config.config.bech32Prefix?.valAddr,
        consAddr: this.config.config.bech32Prefix?.consAddr,
        consPub: this.config.config.bech32Prefix?.consAddr,
      });
    }

    this.restURL$ = new BehaviorSubject(this.config.config.restURL);
    this.websocketURL$ = new BehaviorSubject(this.config.config.websocketURL);
    this.chainID$ = new BehaviorSubject(this.config.config.chainID);
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
