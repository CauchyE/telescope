import { Config, ConfigService, SearchResult } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';
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
  //searchValue$: BehaviorSubject<string>; // 孫→子→親コンポーネントの流れでイベントで渡していく

  //後ほど削除
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
          const address = qs.stringify({ address: event.snapshot.params.address });
          const fixedAddress = address.substring(address.indexOf('=') + 1);
          return fixedAddress;
        } else if ('tx_hash' in event.snapshot.params) {
          const txHash = qs.stringify({ txHash: event.snapshot.params.tx_hash });
          const fixedTxHash = txHash.substring(txHash.indexOf('=') + 1);
          return fixedTxHash;
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
        //console.log('matchBlock', value);
        this.initializeObservables();
        return 1 <= Number(value);
      }),
    );
    //const sub3X = this.matchBlockHeightPattern$.subscribe((str) => console.log('matBlock', str)); //ここまではおk
    //const test = combined$.pipe(map([_, _]));
    //console.log('this.config', this.config);
    //console.log('this.configS', this.configS.config);

    this.matchAccAddressPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        //console.log('matchAdd', value);
        const prefix = this.config.bech32Prefix?.accAddr;
        const prefixCount = this.config.bech32Prefix?.accAddr.length;
        console.log(prefix, prefixCount, value.substring(0, prefixCount));
        this.initializeObservables();
        return value.length == 46 && value.substring(0, prefixCount) === prefix;
      }),
    );
    //const sub4X = this.matchAccAddressPattern$.subscribe((str) => console.log('mataddr', str));

    this.matchTxHashPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        //console.log('matchTx', value);
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
        /*if (!match) {
          console.log('isValidBlockHeight_false_match');
          return of(false);
        }*/

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
    //このサブスクリプションはいるらしい。2021/12/27
    const isValBlksubsc = this.isValidBlockHeight$.subscribe((str) => console.log('isValBlk', str));

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

          console.log('base', baseAccount);
          //console.log('base', await baseAccount);
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
    //このサブスクリプションはいるらしい。2021/12/27
    const sub5X = this.isValidAccAddress$.subscribe((str) => console.log('isValAddr', str));

    this.isValidTxHash$ = combineLatest([this.matchTxHashPattern$, this.cosmosSDK.sdk$]).pipe(
      filter(([matchTxHashPattern, _]) => matchTxHashPattern),
      mergeMap(([match, sdk]) => {
        /*
        if (!match) {
          console.log('isValidAccAddress_false_match');
          return of(false);
        }*/

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
    const isValTxsubsc = this.isValidTxHash$.subscribe((str) => console.log('isValTx', str));

    this.searchResult$ = combineLatest([
      timer(0, 10 * 1000),
      //this.isValidBlockHeight$,
      this.isValidAccAddress$,
      this.isValidTxHash$,
    ]).pipe(
      filter(
        ([isValidBlockHeight, isValidAccAddress, isValidTxHash]) =>
          isValidBlockHeight !== 0 || isValidAccAddress || isValidTxHash,
      ),

      mergeMap(([isValidBlockHeight, isValidAccAddress, isValidTxHash]) => {
        console.log({ isValidBlockHeight, isValidAccAddress, isValidTxHash });
        let inputValue: string = '';
        const searchBoxInputValueSubscription = this.searchBoxInputValue$.subscribe((val) => {
          inputValue = val;
        });
        searchBoxInputValueSubscription.unsubscribe();

        let inputType: string = '';
        //if (isValidBlockHeight) inputType = 'blocks';
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
    /*
    this.searchResult$ = of({ searchValue: '', type: '' });
    this.isValidBlockHeight$ = of(false);
    this.isValidAccAddress$ = of(false);
    this.isValidTxHash$ = of(false);
    */
  }

  onCheckInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
    //console.log('InputValue$', this.searchBoxInputValue$);

    console.log('v', value);
  }
}
