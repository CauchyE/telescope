import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { CosmosDistributionV1beta1QueryCommunityPoolResponse } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  communityPool$: Observable<CosmosDistributionV1beta1QueryCommunityPoolResponse>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    this.communityPool$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.distribution.communityPool(sdk.rest).then((res) => res.data)),
    );
  }

  ngOnInit(): void {}
}
