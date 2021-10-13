import { FaucetGuard } from '../../models/faucets/faucet.guard';
import { FaucetComponent } from './faucet.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FaucetComponent,
    canActivate: [FaucetGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaucetRoutingModule {}
