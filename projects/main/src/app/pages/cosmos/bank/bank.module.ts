import { BankModule } from '../../../views/cosmos/bank/bank.module';
import { SendModule } from '../../../views/cosmos/bank/send/send.module';
import { BankRoutingModule } from './bank-routing.module';
import { BankComponent } from './bank.component';
import { SendComponent } from './send/send.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BankComponent, SendComponent],
  imports: [CommonModule, BankRoutingModule, BankModule, SendModule],
})
export class AppBankModule {}
