import { CosmosSDKService } from '../../../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import { InlineResponse20063Validator } from 'cosmos-client/esm/openapi';
import { Observable, of, combineLatest } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  validator$: Observable<InlineResponse20063Validator | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const validatorAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((addr) => cosmosclient.ValAddress.fromString(addr)),
    );
    console.log(validatorAddress$);

    const combined$ = combineLatest([this.cosmosSDK.sdk$, validatorAddress$]);
    this.validator$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.cosmos.staking.validator(sdk.rest, address)),
      map((result) => result.data.validator!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit() {}
}
