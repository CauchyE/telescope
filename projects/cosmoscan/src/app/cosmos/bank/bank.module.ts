import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { SendComponent } from './send/send.component';
import { BankComponent } from './bank.component';
import { BankModule } from '@view/cosmos/bank/bank.module';
import { SendModule } from '@view/cosmos/bank/send/send.module';

@NgModule({
  declarations: [BankComponent, SendComponent],
  imports: [CommonModule, BankRoutingModule, BankModule, SendModule],
})
export class AppBankModule {}
