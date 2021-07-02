import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CosmosSDKService } from '../model/cosmos-sdk.service';
import * as qs from 'querystring';
import config from '../config.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  config = config;
  searchValue$: Observable<string>;

  constructor(private router: Router, public cosmosSDK: CosmosSDKService) {
    this.searchValue$ = this.router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd && Object.keys(event.snapshot.params).length > 0),
      map((event) => {
        console.log(event.snapshot.params);
        if ('address' in event.snapshot.params) {
          return qs.stringify({ address: event.snapshot.params.address });
        } else if ('tx_hash' in event.snapshot.params) {
          return qs.stringify({ address: event.snapshot.params.tx_hash });
        }
        return '';
      }),
    );
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
