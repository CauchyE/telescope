import { Config, ConfigService, SearchResult } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';
import * as qs from 'querystring';
import { combineLatest, Observable, timer, BehaviorSubject, of } from 'rxjs';
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
  //searchResult$: Observable<SearchResult>; // 親→子→孫コンポーネントの流れで値で渡していく。

  //後ほど削除
  searchWordOption: { label: string; allowed: boolean } = { label: '', allowed: false };

  matchBlockHeightPattern$: Observable<boolean> = of(false);
  matchAccAddressPattern$: Observable<boolean> = of(false);
  matchTxHashPattern$: Observable<boolean> = of(false);

  //isValidBlockHeight$: Observable<boolean>;
  isValidAccAddress$: Observable<boolean>;
  //isValidTxHash$: Observable<boolean>;

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

    //this.searchResult$ = this.searchValue$.combinelatest();
    //

    const timer$ = timer(0, 3 * 1000);
    const sub = timer$.subscribe((n) => console.log('timer=', n)); //ここまではおｋ
    const sub2$ = combineLatest([timer$, this.searchBoxInputValue$]);
    const sub2X = sub2$.subscribe(([n, str]) => console.log('timer2=', n, str)); //ここまではおk

    const combined$ = combineLatest([timer$, this.cosmosSDK.sdk$]).pipe(
      map(([_, sdk]) => {
        console.log('t=', _);
        return sdk;
      }),
    );

    this.matchBlockHeightPattern$ = this.searchBoxInputValue$.pipe(
      map((value) => {
        console.log('matchBlock', value);
        return 1 <= Number(value);
      }),
    );
    const sub3X = this.matchBlockHeightPattern$.subscribe((str) => console.log('matBlock', str)); //ここまではおk

    //const test = combined$.pipe(map([_, _]));

    //console.log('this.config', this.config);
    //console.log('this.configS', this.configS.config);

    this.matchAccAddressPattern$ = this.searchBoxInputValue$.pipe(
      map((value) => {
        console.log('matchAdd', value);
        const prefix = this.config.bech32Prefix?.accAddr;
        const prefixCount = this.config.bech32Prefix?.accAddr.length;
        console.log(prefix, prefixCount, value.substring(0, prefixCount));
        return value.length == 46 && value.substring(0, prefixCount) === prefix;
      }),
    );
    const sub4X = this.matchAccAddressPattern$.subscribe((str) => console.log('mataddr', str));

    this.matchTxHashPattern$ = this.searchBoxInputValue$.pipe(
      map((value) => {
        console.log('matchTx', value);
        return value.length == 64;
      }),
    );

    this.isValidAccAddress$ = combineLatest([this.matchAccAddressPattern$, combined$]).pipe(
      mergeMap(([match, sdk]) => {
        if (!match) {
          console.log('isValidAccAddress_false_match');
          return of(false);
        }

        var inputValue: string = '';
        const value = this.searchBoxInputValue$.subscribe((val) => {
          inputValue = val;
        });
        value.unsubscribe();

        //account api
        const address = cosmosclient.AccAddress.fromString(inputValue);
        const baseAccount = rest.auth
          .account(sdk.rest, address)
          .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.account));

        if (baseAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
          console.log('isValidAccAddress_true', baseAccount);
          return of(true);
        }

        console.log('isValidAccAddress_false_default');
        return of(false);
      }),
    );
    const sub5X = this.isValidAccAddress$.subscribe((str) => console.log('isValAddr', str));
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

  //async onCheckInputValue(value: string) {
  onCheckInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
    //console.log('InputValue$', this.searchBoxInputValue$);

    //console.log('AddrPtn$ ', this.matchAccAddressPattern$);

    /*/以下削除

    console.log('v', value);

    //default value
    this.searchWordOption = { label: value, allowed: true };

    //sdk
    const sdk = await this.cosmosSDK.sdk$.toPromise(); //<-stop

    //check block or not,
    if (1 <= Number(value)) {
      //get block height for validation
      const latestBlock: InlineResponse20035 = await rest.tendermint
        .getLatestBlock(sdk.rest)
        .then((res) => res.data);
      const blockHeight = latestBlock.block?.header?.height;

      //validation & return block
      if (Number(value) <= Number(blockHeight)) {
        this.searchWordOption.allowed = true;
      }
    }

    //account validation
    if (value.length == 46 && value.substring(0, 7) === 'ununifi') {
      console.log('in_address_dayo');

      //account api
      var address = cosmosclient.AccAddress.fromString(value);
      var baseAccount = await rest.auth
        .account(sdk.rest, address)
        .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.account));
      if (baseAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
        this.searchWordOption.allowed = true;
      }
    }

    //transaction validation
    if (value.length == 64) {
      //transaction api
      const tx = await rest.tx.getTx(sdk.rest, value).then((res) => res.data);
      if (tx !== undefined) {
        this.searchWordOption.allowed = true;
      }
    } //*/
  }
}
