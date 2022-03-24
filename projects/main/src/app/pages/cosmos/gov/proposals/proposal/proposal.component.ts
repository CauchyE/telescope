import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import {
  InlineResponse20052Proposals,
  InlineResponse20054Deposits,
  InlineResponse20052FinalTallyResult,
  InlineResponse20057Votes,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20052Proposals | undefined>;
  deposits$: Observable<InlineResponse20054Deposits[] | undefined>;
  tally$: Observable<InlineResponse20052FinalTallyResult | undefined>;
  votes$: Observable<InlineResponse20057Votes[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id));
    console.log('proposalID');
    console.log(proposalID$);

    const combined$ = combineLatest([this.cosmosSDK.sdk$, proposalID$]);
    this.proposal$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.gov.proposal(sdk.rest, address)),
      map((result) => result.data.proposal!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.deposits$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.gov.deposits(sdk.rest, address)),
      map((result) => result.data.deposits!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.tally$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.gov.tallyresult(sdk.rest, address)),
      map((result) => result.data.tally!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votes$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.gov.votes(sdk.rest, address)),
      map((result) => result.data.votes!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void {}
}
