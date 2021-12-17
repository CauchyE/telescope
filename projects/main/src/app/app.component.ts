import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { cosmosclient, rest, proto } from '@cosmos-client/core';
import { InlineResponse20035, InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
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

  searchWordOption: {label:string,allowed:boolean} = {label:"",allowed:false};

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
          const A = qs.stringify({ address: event.snapshot.params.address });
          console.log("A", A)
          return A
        } else if ('tx_hash' in event.snapshot.params) {
          var A = qs.stringify({ txHash: event.snapshot.params.tx_hash });
          console.log("A", A)
          return A
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
    }
  }

  async onCheckInputValue(value: string) {

    //test
    console.log("r",value)

    //default value
    this.searchWordOption = {label:value,allowed:false}

    //get block height for validation
    var sdk = await this.cosmosSDK.sdk$.toPromise();
    var latestBlock : InlineResponse20035 = await rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)
    var blockHeight = latestBlock.block?.header?.height
    console.log("BH",blockHeight) //<- not work

    //validation & return block
    if( 1 <= Number(value) && Number(value) <= Number(blockHeight) ){
      console.log("100",value)
      this.searchWordOption.allowed = true
      return
    }

    //validation & return account
    if( value.length == 43 && value.substring(0,4) === "jpyx" ){
      console.log("in_add")
      var address = cosmosclient.AccAddress.fromString(value);
      var baseAccount = await rest.auth
          .account(sdk.rest, address)
          .then((res) => res.data && cosmosclient.codec.unpackCosmosAny(res.data.account))
      if (baseAccount instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
        this.searchWordOption.allowed = true
        console.log("conglaturation")
        return
      }

      /*
      try {
        const accAddress = cosmosclient.AccAddress.fromString(value);
        this.searchWordOption.allowed = true
        console.log("OK")
        return
      } catch (error) {
        console.error(error);
        return;
      }*/
    }

    //validation & return transaction
    if(value.length == 20){

    }
  }
}
