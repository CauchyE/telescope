import { Component, OnInit } from '@angular/core';
import { CosmosSDKService } from '../../../../../model/cosmos-sdk.service';
import { StakingApplicationService } from '../../../../../model/cosmos/staking.application.service';
import { CreateOnSubmitEvent } from '../../../../../view/cosmos/staking/delegators/create/create.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly stakingApplication: StakingApplicationService,
  ) { }

  ngOnInit(): void { }

  onSubmit($event: CreateOnSubmitEvent) { }
}
