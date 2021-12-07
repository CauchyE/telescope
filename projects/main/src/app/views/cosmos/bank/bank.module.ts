import { MaterialModule } from '../../../views/material.module';
import { BankComponent } from './bank.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BankComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [BankComponent],
})
export class BankModule { }
