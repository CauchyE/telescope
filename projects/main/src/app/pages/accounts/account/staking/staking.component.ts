import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  totalRewards$: Observable<
    CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | undefined
  >;
  //eachRewards$: Observable<QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const accAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((address) => {
        try {
          const accAddress = cosmosclient.AccAddress.fromString(address);
          return accAddress;
        } catch (error) {
          return undefined;
        }
      }),
    );
    const valAddress$ = accAddress$.pipe(
      map((accAddress) => {
        if (accAddress === undefined) {
          return undefined;
        }
        return accAddress.toValAddress();
      }),
    );
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);

    /*
    delegationTotalRewardsで報酬の合計値、Valaddress毎の報酬の両方を取得可能
    Valaddress指定で取得するAPI delegationRewardsは現状コメントアウト
    */
    this.totalRewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress]) => {
        if (accAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution
          .delegationTotalRewards(sdk.rest, accAddress)
          .then((res) => res.data);
      }),
    );

    /*
    this.eachRewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => rest.cosmos.distribution.delegationRewards(sdk.rest, accAddress, valAddress)),
      map((res) => res.data),
    );
    */
  }

  ngOnInit(): void {}
}
