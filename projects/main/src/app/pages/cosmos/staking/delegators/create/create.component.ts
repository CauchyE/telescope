import { CosmosSDKService } from '../../../../../models/cosmos-sdk.service';
import { StakingApplicationService } from '../../../../../models/cosmos/staking.application.service';
import { CreateOnSubmitEvent } from '../../../../../views/cosmos/staking/delegators/create/create.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly stakingApplication: StakingApplicationService,
  ) {}

  ngOnInit(): void {}

  onSubmit($event: CreateOnSubmitEvent) {}
}
