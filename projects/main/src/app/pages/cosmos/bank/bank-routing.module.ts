import { KeySelectGuard } from '../../../models/keys/key-select.guard';
import { BankComponent } from './bank.component';
import { SendComponent } from './send/send.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BankComponent },
  { path: 'send', component: SendComponent, canActivate: [KeySelectGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankRoutingModule {}
