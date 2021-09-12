import { MaterialModule } from '../../../views/material.module';
import { BankComponent } from './bank.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BankComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [BankComponent],
})
export class BankModule {}
