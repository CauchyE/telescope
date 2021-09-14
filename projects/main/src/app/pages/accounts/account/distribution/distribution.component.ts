import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from 'cosmos-client';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20043,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from 'cosmos-client/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-vesting',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  commision$: Observable<QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod>;
  rewards$: Observable<InlineResponse20043>;
  slashes$: Observable<CosmosDistributionV1beta1QueryValidatorSlashesResponse>;

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

    this.commision$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) =>
        rest.cosmos.distribution.validatorCommission(sdk.rest, valAddress),
      ),
      map((res) => res.data),
    );

    this.rewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) =>
        rest.cosmos.distribution.validatorOutstandingRewards(sdk.rest, valAddress),
      ),
      map((res) => res.data),
    );

    this.slashes$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) =>
        rest.cosmos.distribution.validatorSlashes(sdk.rest, valAddress, '1', '2'),
      ),
      map((res) => res.data),
    );
  }

  ngOnInit(): void {}
}
