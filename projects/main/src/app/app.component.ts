import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';
import * as qs from 'querystring';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchValue$: Observable<string>;

  searchWordOption: { label: string; allowed: boolean } = { label: '', allowed: false };

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

  async onCheckInputValue(value: string) {
    console.log('v', value);

    //default value
    this.searchWordOption = { label: value, allowed: false };

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
    }
  }
}
