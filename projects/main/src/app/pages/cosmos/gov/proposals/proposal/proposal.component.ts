import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import {
  InlineResponse20048Proposals,
  InlineResponse20050Deposits,
  InlineResponse20052Tally,
  InlineResponse20053Votes,
} from 'cosmos-client/esm/openapi';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20048Proposals | undefined>;
  deposits$: Observable<InlineResponse20050Deposits[] | undefined>;
  tally$: Observable<InlineResponse20052Tally | undefined>;
  votes$: Observable<InlineResponse20053Votes[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id));
    console.log('proposalID');
    console.log(proposalID$);

    const combined$ = combineLatest([this.cosmosSDK.sdk$, proposalID$]);
    this.proposal$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.cosmos.gov.proposal(sdk.rest, address)),
      map((result) => result.data.proposal!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.deposits$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.cosmos.gov.deposits(sdk.rest, address)),
      map((result) => result.data.deposits!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.tally$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.cosmos.gov.tallyresult(sdk.rest, address)),
      map((result) => result.data.tally!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votes$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.cosmos.gov.votes(sdk.rest, address)),
      map((result) => result.data.votes!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void {
    this.proposal$.subscribe((proposal) => {
      console.log('proposal');
      console.log(proposal);
    });
    this.deposits$.subscribe((deposits) => {
      console.log('deposits');
      console.log(deposits);
    });
    this.tally$.subscribe((tally) => {
      console.log('tally');
      console.log(tally);
    });
    this.votes$.subscribe((votes) => {
      console.log('votes');
      console.log(votes);
    });
  }
}
