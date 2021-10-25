import { Config, ConfigService } from '../../../models/config.service';
import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { Key } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  config: Config;
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;
  accAddress$: Observable<cosmosclient.AccAddress | undefined>;
  valAddress$: Observable<cosmosclient.ValAddress | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;
  faucets$: Observable<
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | undefined
  >;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly key: KeyService,
    private cosmosSDK: CosmosSDKService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.config;
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
    const pubKey$ = this.key$.pipe(
      filter((key) => !!key),
      map((key) => this.key.getPubKey(key!.type, key!.public_key)),
    );

    this.accAddress$ = pubKey$.pipe(map((key) => cosmosclient.AccAddress.fromPublicKey(key)));
    this.valAddress$ = pubKey$.pipe(map((key) => cosmosclient.ValAddress.fromPublicKey(key)));

    this.balances$ = combineLatest([this.cosmosSDK.sdk$, this.accAddress$]).pipe(
      mergeMap(([sdk, address]) => {
        if (address === undefined) {
          return [];
        }
        return rest.bank
          .allBalances(sdk.rest, address)
          .then((res) => res.data.balances || [])
          .catch((_) => []);
      }),
    );

    this.faucets$ = this.balances$.pipe(
      map((balances) => {
        const initialFaucets = this.config?.extension?.faucet?.filter((faucet) => faucet.hasFaucet);
        return initialFaucets?.filter((faucet) => {
          const faucetDenomBalanceNotFound =
            balances.find((balance) => balance.denom === faucet.denom) === undefined;
          const faucetDenomBalanceAmount = balances.find(
            (balance) => balance.denom === faucet.denom,
          )?.amount;
          const faucetDenomBalanceIsLessThanMaxCredit = faucetDenomBalanceAmount
            ? parseInt(faucetDenomBalanceAmount) <= faucet.maxCredit
            : false;
          if (faucetDenomBalanceNotFound || faucetDenomBalanceIsLessThanMaxCredit) {
            return true;
          } else {
            return false;
          }
        });
      }),
    );
  }

  ngOnInit(): void {}
}
