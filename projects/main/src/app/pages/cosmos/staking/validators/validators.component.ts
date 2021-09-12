import { CosmosSDKService } from '../../../../app/models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { rest } from 'cosmos-client';
import { QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod } from 'cosmos-client/esm/openapi';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validators$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.validators$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.cosmos.staking.validators(sdk.rest)),
      map((result) => result.data),
    );
  }

  ngOnInit() {}
}
