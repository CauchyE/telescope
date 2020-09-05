import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidatorsComponent } from './validators.component';
import { ValidatorComponent } from './validator/validator.component';

const routes: Routes = [
  { path: '', component: ValidatorsComponent },
  {
    path: ':address',
    component: ValidatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidatorsRoutingModule {}
