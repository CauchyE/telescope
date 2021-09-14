import { CreateModule } from '../../../views/cosmos/staking/delegators/create/create.module';
import { DelegatorModule } from '../../../views/cosmos/staking/delegators/delegator/delegator.module';
import { DelegatorsModule } from '../../../views/cosmos/staking/delegators/delegators.module';
import { StakingModule } from '../../../views/cosmos/staking/staking.module';
import { ValidatorModule } from '../../../views/cosmos/staking/validators/validator/validator.module';
import { ValidatorsModule } from '../../../views/cosmos/staking/validators/validators.module';
import { CreateComponent } from './delegators/create/create.component';
import { DelegatorComponent } from './delegators/delegator/delegator.component';
import { DelegatorsComponent } from './delegators/delegators.component';
import { StakingRoutingModule } from './staking-routing.module';
import { StakingComponent } from './staking.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { ValidatorsComponent } from './validators/validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
