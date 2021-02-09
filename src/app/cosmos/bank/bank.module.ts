import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { SendComponent } from './send/send.component';
import { BankComponent } from './bank.component';
import { SendModule } from '@view/cosmos/bank/send/send.module';

@NgModule({
  declarations: [BankComponent, SendComponent],
  imports: [CommonModule, BankRoutingModule, SendModule],
})
export class AppBankModule {}
