import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CosmosSDKService } from '@model/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  txHash$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public cosmosSDK: CosmosSDKService,
  ) {
    this.txHash$ = this.route.params.pipe(map((params) => params['tx_hash']));
  }

  onSubmitSDK($event: { url: string; chainID: string }) {
    this.cosmosSDK.update($event.url, $event.chainID);
  }

  async onSubmitTxHash(txHash: string) {
    await this.router.navigate(['txs', txHash]);
  }
}
