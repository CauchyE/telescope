import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from '@view/material.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, MaterialModule],
  exports: [AccountComponent],
})
export class AccountsViewModule { }
