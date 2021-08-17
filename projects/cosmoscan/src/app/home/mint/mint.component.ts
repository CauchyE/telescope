import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from 'cosmos-client';
import { CosmosMintV1beta1QueryInflationResponse } from 'cosmos-client/cjs/openapi/api';
import { CosmosSDKService } from 'projects/cosmoscan/src/model/cosmos-sdk.service';
import { combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {
  inflation$: Observable<CosmosMintV1beta1QueryInflationResponse>;

  constructor(private readonly route: ActivatedRoute, private readonly cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, 60 * 1000);
    const combined$ = combineLatest([timer$, this.cosmosSDK.sdk$]).pipe(map(([_, sdk]) => sdk));
    this.inflation$ = combined$.pipe(
      mergeMap((sdk) => rest.cosmos.mint.inflation(sdk.rest).then((res) => res.data)
    ));
   }

  ngOnInit(): void {
  //一時的にデバッグ用に追加
  console.log('inflation');
  console.log(this.inflation$);
  }
}
