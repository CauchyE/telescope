import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod,
} from 'cosmos-client/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  totalrewards$: Observable<CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse>;
  //eachrewards$: Observable<QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const accAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((addr) => cosmosclient.AccAddress.fromString(addr)),
    );
    const valAddress$ = accAddress$.pipe(map((addr) => addr.toValAddress()));
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);

    /*
    delegationTotalRewardsで報酬の合計値、Valaddress毎の報酬の両方を取得可能
    Valaddress指定で取得するAPI delegationRewardsは現状コメントアウト
    */
    this.totalrewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress]) =>
        rest.cosmos.distribution.delegationTotalRewards(sdk.rest, accAddress),
      ),
      map((res) => res.data),
    );

    /*
    this.eachrewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => rest.cosmos.distribution.delegationRewards(sdk.rest, accAddress, valAddress)),
      map((res) => res.data),
    );
    */
  }

  ngOnInit(): void {}
}
