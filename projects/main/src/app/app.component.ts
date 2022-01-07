import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { SearchResult } from './views/toolbar/toolbar.component';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  config: Config;

  searchBoxInputValue$: BehaviorSubject<string> = new BehaviorSubject('');

  matchBlockHeightPattern$: Observable<boolean>;
  matchAccAddressPattern$: Observable<boolean>;
  matchTxHashPattern$: Observable<boolean>;

  isValidBlockHeight$: Observable<boolean>;
  isValidAccAddress$: Observable<boolean>;
  isValidTxHash$: Observable<boolean>;

  latestBlockHeight$?: Observable<string | undefined>;

  searchResult$: Observable<SearchResult> = of({ searchValue: '', type: '' });

  constructor(
    private router: Router,
    public cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.config = this.configS.config;
    if (this.config.extension?.faucet !== undefined) {
      this.config.extension.navigations.unshift({
        name: 'Faucet',
        link: '/faucet',
        icon: 'clean_hands',
      });
    }

    this.matchBlockHeightPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const regExp = /^[1-9][0-9]*$/;
        return regExp.test(value);
      }),
    );

    this.matchAccAddressPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const prefix = this.config.bech32Prefix?.accAddr ? this.config.bech32Prefix?.accAddr : '';
        const prefixCount = this.config.bech32Prefix?.accAddr.length
          ? this.config.bech32Prefix?.accAddr.length
          : 0;
        const regExp = /^[0-9a-z]{39}$/;
        return regExp.test(value.slice(prefixCount)) && value.substring(0, prefixCount) === prefix;
      }),
    );

    this.matchTxHashPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const regExp = /^[0-9A-Z]{64}$/;
        return regExp.test(value);
      }),
    );

    this.isValidBlockHeight$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchBlockHeightPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchBlockHeightPattern, sdk]) => {
        if (!matchBlockHeightPattern) {
          return of(false);
        }
        try {
          return rest.tendermint.getLatestBlock(sdk.rest).then((res) => {
            return res.data &&
              res.data.block?.header?.height &&
              BigInt(res.data.block?.header?.height) > BigInt(searchBoxInputValue)
              ? BigInt(res.data.block?.header?.height) > BigInt(searchBoxInputValue)
              : false;
          });
        } catch (error) {
          return of(false);
        }
      }),
    );

    this.isValidAccAddress$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchAccAddressPattern$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchAccAddressPattern]) => {
        if (!matchAccAddressPattern) {
          return of(false);
        }
        try {
          const address = cosmosclient.AccAddress.fromString(searchBoxInputValue);
          if (address instanceof cosmosclient.AccAddress) {
            return of(true);
          } else {
            return of(false);
          }
        } catch (error) {
          return of(false);
        }
      }),
    );

    this.isValidTxHash$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchTxHashPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchTxHashPattern, sdk]) => {
        if (!matchTxHashPattern) {
          return of(false);
        }
        try {
          const tx = rest.tx
            .getTx(sdk.rest, searchBoxInputValue)
            .then((res) => {
              console.log(res);
              return res.data.tx;
            })
            .catch((error) => false);
          return tx;
        } catch (error) {
          return of(false);
        }
      }),
      map((tx) => {
        if (tx) {
          return true;
        } else {
          return false;
        }
      }),
    );

    this.searchResult$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchBlockHeightPattern$,
      this.matchAccAddressPattern$,
      this.matchTxHashPattern$,
      this.isValidBlockHeight$,
      this.isValidAccAddress$,
      this.isValidTxHash$,
    ]).pipe(
      map(
        ([
          searchBoxInputValue,
          matchBlockHeightPattern,
          matchAccAddressPattern,
          matchTxHashPattern,
          isValidBlockHeight,
          isValidAccAddress,
          isValidTxHash,
        ]) => {
          if (searchBoxInputValue === true) {
            return { searchValue: '', type: '' };
          }
          if (searchBoxInputValue === false) {
            return { searchValue: '', type: '' };
          }
          if (searchBoxInputValue) {
            if (matchBlockHeightPattern && isValidBlockHeight) {
              return { searchValue: searchBoxInputValue, type: 'block' };
            }
            if (matchAccAddressPattern && isValidAccAddress) {
              return { searchValue: searchBoxInputValue, type: 'address' };
            }
            if (matchTxHashPattern && isValidTxHash) {
              return { searchValue: searchBoxInputValue, type: 'txHash' };
            }
            return { searchValue: searchBoxInputValue, type: '' };
          } else {
            return { searchValue: searchBoxInputValue, type: '' };
          }
        },
      ),
    );
  }

  async onSubmitSearchResult(searchResult: SearchResult) {
    if (searchResult.type === 'address') {
      await this.router.navigate(['accounts', searchResult.searchValue]);
    } else if (searchResult.type === 'txHash') {
      await this.router.navigate(['txs', searchResult.searchValue]);
    } else if (searchResult.type === 'block') {
      await this.router.navigate(['blocks', searchResult.searchValue]);
    }
  }

  onChangeInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
  }
}
