import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [BankComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [BankComponent],
})
export class BankModule { }
