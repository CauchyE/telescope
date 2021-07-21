import { Component, Input, OnInit } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod,
} from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'app-view-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  @Input()
  totalrewards?: CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | null;
  @Input()
  eachrewards?: QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod | null;

  constructor() { }

  ngOnInit(): void { }
}
