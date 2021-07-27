import { Component, Input, OnInit } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20043,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'app-view-vesting',
  templateUrl: './vesting.component.html',
  styleUrls: ['./vesting.component.css'],
})
export class VestingComponent implements OnInit {
  @Input()
  commision?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  rewards?: InlineResponse20043 | null;
  @Input()
  description?: CosmosDistributionV1beta1QueryValidatorSlashesResponse | null;

  constructor() { }

  ngOnInit(): void { }
}
