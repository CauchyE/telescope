import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20047,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  commission$: Observable<
    | QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod
    | undefined
  >;
  rewards$: Observable<InlineResponse20047 | undefined>;
  slashes$: Observable<CosmosDistributionV1beta1QueryValidatorSlashesResponse | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly snackBar: MatSnackBar,
  ) {
    const accAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((address) => {
        try {
          const accAddress = cosmosclient.AccAddress.fromString(address);
          return accAddress;
        } catch (error) {
          console.error(error);
          this.snackBar.open('Invalid address!', undefined, { duration: 3000 });
          return undefined;
        }
      }),
    );
    const valAddress$ = accAddress$.pipe(
      map((address) => {
        if (address === undefined) {
          return undefined;
        }
        return address.toValAddress();
      }),
    );
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);

    this.commission$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution.validatorCommission(sdk.rest, valAddress).then((res) => res.data);
      }),
    );

    this.rewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution
          .validatorOutstandingRewards(sdk.rest, valAddress)
          .then((res) => res.data);
      }),
    );

    this.slashes$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution
          .validatorSlashes(sdk.rest, valAddress, '1', '2') // Todo: '2' must be fixed to latest block height and add pagination support!
          .then((res) => res.data);
      }),
    );
  }

  ngOnInit(): void { }
}
