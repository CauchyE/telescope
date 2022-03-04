import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  blockHeight$: Observable<string>;
  block$: Observable<InlineResponse20036>;
  validatorsets$: Observable<CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.blockHeight$ = this.route.params.pipe(map((params) => params.block_height));
    this.block$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$]).pipe(
      mergeMap(([sdk, height]) =>
        rest.tendermint.getBlockByHeight(sdk.rest, BigInt(height)).then((res) => res.data),
      ),
    );
    this.validatorsets$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$]).pipe(
      mergeMap(([sdk, height]) =>
        rest.tendermint.getValidatorSetByHeight(sdk.rest, height).then((res) => res.data),
      ),
    );
  }

  ngOnInit(): void {}
}
