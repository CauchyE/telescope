import { Component, OnInit } from '@angular/core';
import { CosmosSDKService } from '@model/index';
import { staking } from 'cosmos-client/x/staking';
import { Observable, from } from 'rxjs';
import { Validator } from 'cosmos-client/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validators$: Observable<Validator[]>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.validators$ = from(staking.validatorsGet(this.cosmosSDK.sdk)).pipe(
      map((result) => result.data.result),
    );
  }

  ngOnInit() {}
}
