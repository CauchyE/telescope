import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { SendComponent } from './send/send.component';
import { SendModule } from '@view/cosmos/bank/send/send.module';

@NgModule({
  declarations: [SendComponent],
  imports: [CommonModule, BankRoutingModule, SendModule],
})
export class BankModule {}
