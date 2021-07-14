import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';

@NgModule({
  declarations: [BankComponent],
  imports: [CommonModule],
  exports: [BankComponent],
})
export class BankModule { }
