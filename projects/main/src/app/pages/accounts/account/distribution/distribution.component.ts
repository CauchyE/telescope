import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20047,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { of, combineLatest, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { InlineResponse20035 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'app-vesting',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  commision$: Observable<QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod>;
  rewards$: Observable<InlineResponse20047>;
  slashes$: Observable<CosmosDistributionV1beta1QueryValidatorSlashesResponse | undefined>;

  latestBlock$: Observable<InlineResponse20035 | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const accAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((address) => cosmosclient.AccAddress.fromString(address)),
    );
    const valAddress$ = accAddress$.pipe(map((addr) => addr.toValAddress()));
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);

    this.commision$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) =>
        rest.distribution.validatorCommission(sdk.rest, valAddress),
      ),
      map((res) => res.data),
    );

    this.rewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) =>
        rest.distribution.validatorOutstandingRewards(sdk.rest, valAddress),
      ),
      map((res) => res.data),
    );

    this.latestBlock$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) =>
        rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)),
    );

    this.slashes$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$, this.latestBlock$]).pipe(
      mergeMap(([sdk, accAddress, valAddress, latestBlock]) =>
        rest.distribution.validatorSlashes(
          sdk.rest,
          valAddress,
          '1',
          latestBlock?.block?.header?.height,
          undefined,
          BigInt(1),
          BigInt(latestBlock?.block?.header?.height || 2),
          true
        ),
      ),
      map((res) => {
        console.log("slash", res.data) //debug
        return res.data
      }),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void { }
}
