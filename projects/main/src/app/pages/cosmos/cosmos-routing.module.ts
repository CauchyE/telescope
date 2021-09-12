import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'bank',
    loadChildren: () =>
      import('./bank/bank.module').then((mod) => mod.AppBankModule),
  },
  {
    path: 'gov',
    loadChildren: () =>
      import('./gov/gov.module').then((mod) => mod.AppGovModule),
  },
  {
    path: 'staking',
    loadChildren: () =>
      import('./staking/staking.module').then((mod) => mod.AppStakingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CosmosRoutingModule {}
