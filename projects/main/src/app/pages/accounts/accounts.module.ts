import { AccountModule } from '../../views/accounts/account/account.module';
import { BankModule } from '../../views/accounts/account/bank/bank.module';
import { DistributionModule } from '../../views/accounts/account/distribution/distribution.module';
import { StakingModule } from '../../views/accounts/account/staking/staking.module';
import { TxsModule } from '../../views/accounts/account/txs/txs.module';
import { AccountComponent } from './account/account.component';
import { BankComponent } from './account/bank/bank.component';
import { DistributionComponent } from './account/distribution/distribution.component';
import { StakingComponent } from './account/staking/staking.component';
import { TxsComponent } from './account/txs/txs.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AccountComponent,
    BankComponent,
    StakingComponent,
    DistributionComponent,
    TxsComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountModule,
    BankModule,
    StakingModule,
    DistributionModule,
    TxsModule,
  ],
})
export class AppAccountsModule {}
