import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bank',
    loadChildren: () =>
      import('./bank/bank.module').then((mod) => mod.BankModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosmosRoutingModule {}
