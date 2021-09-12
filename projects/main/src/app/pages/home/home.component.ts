import { CosmosSDKService } from '../../models/cosmos-sdk.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { rest } from 'cosmos-client';
import { InlineResponse20033 } from 'cosmos-client/esm/openapi';
import { combineLatest, Observable, timer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  nodeInfo$: Observable<InlineResponse20033>;
  syncing$: Observable<boolean>;

  constructor(private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, 60 * 1000);
    const combined$ = combineLatest([timer$, this.cosmosSDK.sdk$]).pipe(map(([_, sdk]) => sdk));

    this.nodeInfo$ = combined$.pipe(
      mergeMap((sdk) => rest.cosmos.tendermint.getNodeInfo(sdk.rest).then((res) => res.data)),
    );

    this.syncing$ = combined$.pipe(
      mergeMap((sdk) =>
        rest.cosmos.tendermint.getSyncing(sdk.rest).then((res) => res.data.syncing || false),
      ),
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
