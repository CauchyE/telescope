import { Component, Input, OnInit } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  /*QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod,*/
} from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  /*
    delegationTotalRewardsで報酬の合計値、Valaddress毎の報酬の両方を取得可能
    Valaddress指定で取得するAPI delegationRewardsは現状コメントアウト
  */
  @Input()
  totalRewards?: CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | null;
  /*
  @Input()
  eachrewards?: QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod | null;
  */

  constructor() {}

  ngOnInit(): void {}
}
