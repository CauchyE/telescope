import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20043,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'app-view-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  @Input()
  commision?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  rewards?: InlineResponse20043 | null;
  @Input()
  description?: CosmosDistributionV1beta1QueryValidatorSlashesResponse | null;

  constructor() { }

  ngOnInit(): void { }
}
