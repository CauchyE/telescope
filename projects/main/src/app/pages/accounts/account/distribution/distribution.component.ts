import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, rest } from '@cosmos-client/core';
import { PageEvent } from '@angular/material/paginator';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20047,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/main/src/app/models/cosmos-sdk.service';
import { BehaviorSubject, of, combineLatest, Observable } from 'rxjs';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { InlineResponse20035 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  displaySizeOptions = [5, 10, 20, 50, 100];
  displaySize$: BehaviorSubject<number> = new BehaviorSubject(10);
  displayNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  displayLength$: BehaviorSubject<number> = new BehaviorSubject(0);

  commission$: Observable<
    | QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod
    | undefined
  >;
  rewards$: Observable<InlineResponse20047 | undefined>;
  slashes$: Observable<CosmosDistributionV1beta1QueryValidatorSlashesResponse | undefined>;

  latestBlock$: Observable<InlineResponse20035 | undefined>;
  slashingDisplayOffset$: Observable<bigint>;
  slashesTotalCount$: Observable<bigint>;

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

    this.latestBlock$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) =>
        rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)),
    );

    this.slashesTotalCount$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$, this.latestBlock$]).pipe(
      switchMap(([sdk, address, valAddress, latestBlock]) => {
        /*
        if (valAddress === undefined) {
          return BigInt(0);
        }
        */
        return rest.distribution
          .validatorSlashes(
            sdk.rest,
            valAddress!,
            '1',
            String(latestBlock),
            undefined,
            undefined,
            undefined,
            true
          )
          .then((res) =>
            res.data.slashes?.length ? BigInt(res.data.slashes?.length) : BigInt(0),
          )
      }),
    );

    this.slashesTotalCount$.subscribe((slashesTotalCount) => {
      this.displayLength$.next(parseInt(slashesTotalCount.toString()));
    });

    this.slashingDisplayOffset$ = combineLatest([this.displayNumber$, this.displaySize$, this.displayLength$]).pipe(
      map(([displayNumber, displaySize, latestBlock]) => {
        const displayOffset = BigInt(latestBlock) - BigInt(displaySize) * BigInt(displayNumber);
        return displayOffset;
      }),
    );

    this.slashes$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$, this.displaySize$, this.displayNumber$, this.displayLength$]).pipe(
      switchMap(([sdk, accAddress, valAddress, displaySize, displayOffset, latestBlock]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        const modifiedDisplayOffset = displayOffset < 1 ? BigInt(1) : BigInt(displayOffset);
        const modifiedDisplaySize = displayOffset < 1 ? BigInt(displayOffset) + BigInt(displaySize) : BigInt(displaySize);
        return rest.distribution
          .validatorSlashes(
            sdk.rest,
            valAddress,
            '1',
            String(latestBlock),
            undefined,
            modifiedDisplayOffset,
            modifiedDisplaySize,
            true
          )
          .then((res) => res.data);
      }),
    );
  }

  ngOnInit(): void { }

  appPaginationChanged(pageEvent: PageEvent): void {
    this.displaySize$.next(pageEvent.pageSize);
    this.displayNumber$.next(pageEvent.pageIndex + 1);
  }
}
