import { KeySelectGuard } from '../../../models/keys/key-select.guard';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingComponent } from './staking.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { ValidatorsComponent } from './validators/validators.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StakingComponent,
  },
  {
    path: 'create-validator',
    component: CreateValidatorComponent,
    canActivate: [KeySelectGuard],
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
