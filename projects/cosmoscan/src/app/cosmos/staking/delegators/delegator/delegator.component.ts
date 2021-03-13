import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosSDKService } from '@model/cosmos-sdk.service';
import { AccAddress } from 'cosmos-client';
import { Delegation, Validator } from 'cosmos-client/api';
import { staking } from 'cosmos-client/x/staking';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  delegations$: Observable<Delegation[]>;
  validators$: Observable<Validator[]>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const address$ = this.route.params.pipe(map((params) => params['address']));

    this.delegations$ = address$.pipe(
      mergeMap((address) =>
        staking.delegatorsDelegatorAddrDelegationsGet(
          this.cosmosSDK.sdk,
          AccAddress.fromBech32(address),
        ),
      ),
      map((res) => res.data.result),
    );

    this.validators$ = address$.pipe(
      mergeMap((address) =>
        staking.delegatorsDelegatorAddrValidatorsGet(
          this.cosmosSDK.sdk,
          AccAddress.fromBech32(address),
        ),
      ),
      map((res) => res.data.result),
    );
  }

  ngOnInit(): void {}
}
