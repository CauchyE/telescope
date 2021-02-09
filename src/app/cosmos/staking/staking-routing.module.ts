import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StakingComponent } from './staking.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { ValidatorsComponent } from './validators/validators.component';

const routes: Routes = [
  {
    path: '',
    component: StakingComponent,
  },
  {
    path: 'validators',
    children: [
      { path: '', component: ValidatorsComponent },
      { path: ':address', component: ValidatorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StakingRoutingModule {}
