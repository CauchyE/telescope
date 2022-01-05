import { Config, ConfigService, SearchResult } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import * as qs from 'querystring';
import { combineLatest, Observable, zip, from, timer, BehaviorSubject, of } from 'rxjs';
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

  A: Observable<unknown>; //仮
  B: Observable<unknown>; //仮
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

    //block validation 1
    this.matchBlockHeightPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        console.log('in_block', value);
        return 1 <= Number(value);
      }),
    );

    //block validation 2
    this.latestBlockHeight$ = combineLatest([
      this.matchBlockHeightPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      filter(([matchBlockHeightPattern, _]) => matchBlockHeightPattern),
      mergeMap(([_, sdk]) => {
        const height = rest.tendermint
          .getLatestBlock(sdk.rest)
          .then((res) => res.data && res.data.block?.header?.height);
        return from(height);
      }),
    );

    //block check
    this.isValidBlockHeight$ = combineLatest([
      this.latestBlockHeight$,
      this.searchBoxInputValue$,
    ]).pipe(
      mergeMap(([blockHeight, inputNumber]) => {
        //get block height for validation
        console.log({ inputNumber, blockHeight });

        if (Number(inputNumber) <= Number(blockHeight)) return of(true);

        console.log('isValidBlockHeight_false_default');
        return of(false);
      }),
    );

    //Address validation 1
    this.matchAccAddressPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const prefix = this.config.bech32Prefix?.accAddr;
        const prefixCount = this.config.bech32Prefix?.accAddr.length;
        console.log({ prefix, prefixCount });
        return value.length == 46 && value.substring(0, prefixCount) === prefix;
      }),
    );

    //Address check 1
    this.A = combineLatest([
      this.matchAccAddressPattern$,
      this.cosmosSDK.sdk$,
      this.searchBoxInputValue$,
    ]).pipe(
      filter(([matchAccAddressPattern, _, __]) => matchAccAddressPattern),
      mergeMap(([_, sdk, inputValue]) => {
        try {
          console.log('try');
          //account api
          const address = cosmosclient.AccAddress.fromString(inputValue);
          const baseAccount = rest.auth
            .account(sdk.rest, address)
            .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.account));
          return from(baseAccount);
        } catch (error) {
          console.error(error);
          return of();
        }
      }),
    );

    //Address check 2
    this.isValidAccAddress$ = this.A.pipe(
      map((account) => {
        console.log(account);
        if (account instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
          console.log('isValidAccAddress_true');
          return true;
        }
        return false;
      }),
    );

    //Transaction validation 1
    this.matchTxHashPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        return value.length == 64;
      }),
    );
    //Transaction check 1
    this.B = combineLatest([
      this.matchTxHashPattern$,
      this.cosmosSDK.sdk$,
      this.searchBoxInputValue$,
    ]).pipe(
      filter(([matchTxHashPattern, _, __]) => matchTxHashPattern),
      mergeMap(([_, sdk, hash]) => {
        try {
          const transaction = rest.tx
            .getTx(sdk.rest, hash)
            .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.tx_response));
          return from(transaction);
        } catch (error) {
          console.error(error);
          return of();
        }
      }),
    );

    //Transaction check 2
    this.isValidTxHash$ = this.B.pipe(
      map((tx) => {
        if (tx instanceof proto.cosmos.tx.v1beta1.GetTxResponse) {
          console.log('isValidTx_true', tx);
          console.log({ tx });
          return true;
        }
        console.log('isValidTxHash_false_default');
        return false;
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
    this.searchResult$ = of({ searchValue: '', type: '' });
    this.isValidBlockHeight$ = of(false);
    this.isValidAccAddress$ = of(false);
    this.isValidTxHash$ = of(false);
  }

  onCheckInputValue(value: string) {
    this.initializeObservables();
    this.searchBoxInputValue$.next(value);
    console.log('v', value);
  }
}
