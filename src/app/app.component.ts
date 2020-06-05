import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CosmosSDKService } from '@model/state.service';
import * as qs from 'querystring';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchValue$: Observable<string>;

  constructor(private router: Router, public cosmosSDK: CosmosSDKService) {
    this.searchValue$ = this.router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      map((event) => {
        const { address, tx_hash } = event.snapshot.params;
        switch (true) {
          case !!address:
            return qs.stringify({ address });
          case !!tx_hash:
            return qs.stringify({ tx_hash });
          default:
            return '';
        }
      }),
    );
  }

  onSubmitSDK($event: { url: string; chainID: string }) {
    this.cosmosSDK.update($event.url, $event.chainID);
  }

  async onSubmitSearchValue(value: string) {
    const { address, tx_hash } = qs.parse(value);
    switch (true) {
      case !!address:
        await this.router.navigate(['accounts', address]);
        break;
      case !!tx_hash:
        await this.router.navigate(['txs', tx_hash]);
        break;
    }
  }
}
