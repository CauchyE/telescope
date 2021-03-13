import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StakingRoutingModule } from './staking-routing.module';
import { StakingComponent } from './staking.component';
import { DelegatorsComponent } from './delegators/delegators.component';
import { DelegatorComponent } from './delegators/delegator/delegator.component';
import { CreateComponent } from './delegators/create/create.component';
import { ValidatorsComponent } from './validators/validators.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { StakingModule } from '@view/cosmos/staking/staking.module';
import { DelegatorsModule } from '@view/cosmos/staking/delegators/delegators.module';
import { DelegatorModule } from '@view/cosmos/staking/delegators/delegator/delegator.module';
import { CreateModule } from '@view/cosmos/staking/delegators/create/create.module';
import { ValidatorsModule } from '@view/cosmos/staking/validators/validators.module';
import { ValidatorModule } from '@view/cosmos/staking/validators/validator/validator.module';

@NgModule({
  declarations: [
    StakingComponent,
    DelegatorsComponent,
    DelegatorComponent,
    CreateComponent,
    ValidatorsComponent,
    ValidatorComponent,
  ],
  imports: [
    CommonModule,
    StakingRoutingModule,
    StakingModule,
    DelegatorsModule,
    DelegatorModule,
    CreateModule,
    ValidatorsModule,
    ValidatorModule,
  ],
})
export class AppStakingModule {}
