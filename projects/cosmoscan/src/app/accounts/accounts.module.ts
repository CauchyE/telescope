import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountModule } from '../../view/accounts/account/account.module';
import { AccountComponent } from './account/account.component';
import { BankComponent } from './account/bank/bank.component';
import { StakingComponent } from './account/staking/staking.component';
import { VestingComponent } from './account/vesting/vesting.component';
import { BankModule } from '../../view/accounts/account/bank/bank.module';
import { StakingModule } from '../../view/accounts/account/staking/staking.module';
import { VestingModule } from '../../view/accounts/account/vesting/vesting.module';

@NgModule({
  declarations: [AccountComponent, BankComponent, StakingComponent, VestingComponent],
  imports: [CommonModule, AccountsRoutingModule, AccountModule, BankModule, StakingModule, VestingModule],
})
export class AppAccountsModule { }
