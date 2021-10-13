import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
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
}
