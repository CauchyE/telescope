import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import {
  CosmosMintV1beta1QueryAnnualProvisionsResponse,
  CosmosMintV1beta1QueryInflationResponse,
} from 'cosmos-client/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  inflation$: Observable<CosmosMintV1beta1QueryInflationResponse>;
  annualProvisions$: Observable<CosmosMintV1beta1QueryAnnualProvisionsResponse>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    this.inflation$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.cosmos.mint.inflation(sdk.rest).then((res) => res.data)),
    );
    this.annualProvisions$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.cosmos.mint.annualProvisions(sdk.rest).then((res) => res.data)),
    );
  }

  ngOnInit(): void {}
}
