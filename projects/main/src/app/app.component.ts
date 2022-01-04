import { Config, ConfigService, SearchResult } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import * as qs from 'querystring';
import { combineLatest, Observable, from, timer, BehaviorSubject, of } from 'rxjs';
import { mergeMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchValue$: Observable<string>;
  searchBoxInputValue$: BehaviorSubject<string> = new BehaviorSubject(''); //孫から受け取るもの。

  //debug 以下の変数は後ほど削除する。
  //searchWordOption: { label: string; allowed: boolean } = { label: '', allowed: false };

  matchBlockHeightPattern$: Observable<boolean> = of(false);
  matchAccAddressPattern$: Observable<boolean> = of(false);
  matchTxHashPattern$: Observable<boolean> = of(false);

  isValidBlockHeight$: Observable<boolean> = of(false);
  isValidAccAddress$: Observable<boolean> = of(false);
  isValidTxHash$: Observable<boolean> = of(false);

  latestBlockHeight$: Observable<string | undefined>;

  searchResult$: Observable<SearchResult> = of({ searchValue: '', type: '' }); // 親→子→孫コンポーネントの流れで値で渡していく。

  config: Config;

  constructor(
    private router: Router,
    public cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.searchValue$ = this.router.events.pipe(
      filter(
        (event): event is ActivationEnd =>
          event instanceof ActivationEnd && Object.keys(event.snapshot.params).length > 0,
      ),
      map((event) => {
        console.log(event.snapshot.params);
        if ('address' in event.snapshot.params) {
          return qs.stringify({ address: event.snapshot.params.address });
        } else if ('tx_hash' in event.snapshot.params) {
          return qs.stringify({ txHash: event.snapshot.params.tx_hash });
        }
        return '';
      }),
    );

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
        this.initializeObservables();
        return 1 <= Number(value);
      }),
    );

    this.matchAccAddressPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const prefix = this.config.bech32Prefix?.accAddr;
        const prefixCount = this.config.bech32Prefix?.accAddr.length;
        this.initializeObservables();
        return value.length == 46 && value.substring(0, prefixCount) === prefix;
      }),
    );

    this.matchTxHashPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        this.initializeObservables();
        return value.length == 64;
      }),
    );

    this.latestBlockHeight$ = of(''); //for initialize
    this.isValidBlockHeight$ = combineLatest([
      this.matchBlockHeightPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      filter(([matchBlockHeightPattern, _]) => matchBlockHeightPattern),
      mergeMap(([_, sdk]) => {
        //get block height for validation
        let inputNumber: number = 0;
        const searchBoxInputValueSubscription = this.searchBoxInputValue$.subscribe((val) => {
          inputNumber = Number(val);
          console.log('inputNumber', inputNumber);
          searchBoxInputValueSubscription.unsubscribe();
        });

        this.latestBlockHeight$ = from(
          rest.tendermint
            .getLatestBlock(sdk.rest)
            .then((res) => res.data && res.data.block?.header?.height),
        );
        console.log('val', this.latestBlockHeight$);

        let blockHeight = 0;
        const subscriptionLatestBlockHeight = this.latestBlockHeight$.subscribe((val) => {
          console.log('val', val);
          blockHeight = Number(val);
          subscriptionLatestBlockHeight.unsubscribe();
          //validation & return block
        });
        console.log({ inputNumber, blockHeight });

        if (Number(inputNumber) <= Number(blockHeight)) return of(true);

        console.log('isValidBlockHeight_false_default');
        return of(false);
      }),
    );

    this.isValidAccAddress$ = combineLatest([
      this.matchAccAddressPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      filter(([matchAccAddressPattern, _]) => matchAccAddressPattern),
      mergeMap(([match, sdk]) => {
        if (!match) {
          console.log('isValidAccAddress_false_match');
          return of(false);
        }

        let inputValue: string = '';
        const searchBoxInputValueSubscription = this.searchBoxInputValue$.subscribe((val) => {
          inputValue = val;
        });
        console.log(inputValue);
        searchBoxInputValueSubscription.unsubscribe();

        try {
          //account api
          const address = cosmosclient.AccAddress.fromString(inputValue);
          const baseAccount = rest.auth
            .account(sdk.rest, address)
            .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.account));

          if (baseAccount !== undefined) {
            console.log('isValidAccAddress_true');
            return of(true);
          }
        } catch (error) {
          console.error(error);
          return of(false);
        }

        console.log('isValidAccAddress_false_default');
        return of(false);
      }),
    );

    this.isValidTxHash$ = combineLatest([this.matchTxHashPattern$, this.cosmosSDK.sdk$]).pipe(
      filter(([matchTxHashPattern, _]) => matchTxHashPattern),
      mergeMap(([match, sdk]) => {
        let hash: string = '';
        const searchBoxInputValueSubscription = this.searchBoxInputValue$.subscribe((val) => {
          hash = val;
        });
        console.log(hash);
        searchBoxInputValueSubscription.unsubscribe();

        const transaction = rest.tx.getTx(sdk.rest, hash);

        if (transaction !== undefined) {
          console.log('isValidTx_true', transaction);
          return of(true);
        }

        console.log('isValidTxHash_false_default');
        return of(false);
      }),
    );

    this.searchResult$ = combineLatest([
      timer(0, 10 * 1000),
      //this.isValidBlockHeight$, //debug
      this.isValidAccAddress$,
      this.isValidTxHash$,
    ]).pipe(
      filter(
        ([isValidBlockHeight, isValidAccAddress, isValidTxHash]) =>
          isValidBlockHeight !== 0 || isValidAccAddress || isValidTxHash, // !== 0 -> debug
      ),

      mergeMap(([isValidBlockHeight, isValidAccAddress, isValidTxHash]) => {
        console.log({ isValidBlockHeight, isValidAccAddress, isValidTxHash });
        let inputValue: string = '';
        const searchBoxInputValueSubscription = this.searchBoxInputValue$.subscribe((val) => {
          inputValue = val;
        });
        searchBoxInputValueSubscription.unsubscribe();

        let inputType: string = '';
        //if (isValidBlockHeight) inputType = 'blocks'; //debug
        if (isValidAccAddress) inputType = 'address';
        if (isValidTxHash) inputType = 'transactions';

        return of({ searchValue: inputValue, type: inputType });
      }),
    );
    const subX = this.searchResult$.subscribe((str) => console.log('isValRes', str));
  }

  async onSubmitSearchValue(value: string) {
    const params = qs.parse(value);
    console.log(params);

    if ('address' in params) {
      await this.router.navigate(['accounts', params.address]);
    } else if ('tx_hash' in params) {
      await this.router.navigate(['txs', params.tx_hash]);
    } else if ('blocks' in params) {
      await this.router.navigate(['blocks', params.blocks]);
    }
  }

  async getBlockHeight(value: string) {}

  initializeObservables() {
    //debug
    // 初期化が必要だが、現在Observableの更新が３回走るようになっており、
    // ３回目の更新で判定結果が消されるため初期化できない。
    /*
    this.searchResult$ = of({ searchValue: '', type: '' });
    this.isValidBlockHeight$ = of(false);
    this.isValidAccAddress$ = of(false);
    this.isValidTxHash$ = of(false);
    */
  }

  onCheckInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
    console.log('v', value);
  }
}
