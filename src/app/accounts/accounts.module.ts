import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsViewModule } from '@view/accounts/accounts.module';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, AccountsRoutingModule, AccountsViewModule],
})
export class AccountsModule {}
