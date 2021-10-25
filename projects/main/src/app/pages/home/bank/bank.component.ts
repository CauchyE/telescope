import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
})
export class BankComponent implements OnInit {
  totalSupply$: Observable<QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const timer$ = timer(0, 60 * 1000);
    const combined$ = combineLatest([timer$, this.cosmosSDK.sdk$]).pipe(map(([_, sdk]) => sdk));
    this.totalSupply$ = combined$.pipe(
      mergeMap((sdk) => rest.bank.totalSupply(sdk.rest).then((res) => res.data)),
    );
  }

  ngOnInit(): void {}
}
