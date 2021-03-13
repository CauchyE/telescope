import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosSDKService } from '@model/index';
import { staking } from 'cosmos-client/x/staking';
import { Observable, from, of } from 'rxjs';
import { Validator } from 'cosmos-client/api';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ValAddress } from 'cosmos-client';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  validator$: Observable<Validator | undefined>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
  ) {
    const validatorAddress$ = this.route.params.pipe(
      map(({ address }) => address as string),
    );
    this.validator$ = validatorAddress$.pipe(
      mergeMap((address) =>
        staking.validatorsValidatorAddrGet(
          this.cosmosSDK.sdk,
          ValAddress.fromBech32(address),
        ),
      ),
      map((result) => result.data.result),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit() {}
}
