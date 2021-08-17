import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InlineResponse20048 } from 'cosmos-client/cjs/openapi/api';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { rest } from 'cosmos-client';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {
  proposals$: Observable<InlineResponse20048>;

  constructor(private readonly route: ActivatedRoute, private readonly cosmosSDK: CosmosSDKService) {
    this.proposals$ = this.cosmosSDK.sdk$.pipe(
      mergeMap(sdk => rest.cosmos.gov.proposals(sdk.rest)),
      map((result) => result.data),
    );
   }

  ngOnInit(): void {
  }

}
