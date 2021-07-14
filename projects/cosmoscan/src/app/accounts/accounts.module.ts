import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountModule } from '../../view/accounts/account/account.module';
import { AccountComponent } from './account/account.component';
import { BankComponent } from './account/bank/bank.component';
import { StakingComponent } from './account/staking/staking.component';
import { BankModule } from '../../view/accounts/account/bank/bank.module';
import { StakingModule } from '../../view/accounts/account/staking/staking.module';

@NgModule({
  declarations: [AccountComponent, BankComponent, StakingComponent],
  imports: [CommonModule, AccountsRoutingModule, AccountModule, BankModule, StakingModule],
})
export class AppAccountsModule { }
