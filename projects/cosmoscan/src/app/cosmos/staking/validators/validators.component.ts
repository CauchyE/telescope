import { Component, OnInit } from '@angular/core';
import { CosmosSDKService } from '../../../../model/cosmos-sdk.service';
import { Observable, from } from 'rxjs';
import { rest } from 'cosmos-client';
import { map, mergeMap } from 'rxjs/operators';
import { QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validators$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.validators$ = this.cosmosSDK.sdk$.pipe(
      mergeMap(sdk => rest.cosmos.staking.validators(sdk.rest)),
      map((result) => result.data),
    );
  }

  ngOnInit() { }
}
