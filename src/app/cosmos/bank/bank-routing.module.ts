import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeySelectGuard } from '@model/keys/key-select.guard';
import { SendComponent } from './send/send.component';

const routes: Routes = [
  { path: 'send', component: SendComponent, canActivate: [KeySelectGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankRoutingModule {}
