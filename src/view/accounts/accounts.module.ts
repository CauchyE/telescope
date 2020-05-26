import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule],
  exports: [AccountComponent],
})
export class AccountsViewModule {}
