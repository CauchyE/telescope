import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TxComponent } from './txs/tx/tx.component';
import { DesignationGuard } from './core/guards/designation.guard';
import { ValidatorsComponent } from './validators/validators.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { AccountComponent } from './accounts/account/account.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'txs/:hash', component: TxComponent, canActivate: [DesignationGuard] },
  {
    path: 'accounts/:address',
    component: AccountComponent,
    canActivate: [DesignationGuard]
  },
  {
    path: 'validators',
    component: ValidatorsComponent,
    canActivate: [DesignationGuard]
  },
  {
    path: 'validators/:address',
    component: ValidatorComponent,
    canActivate: [DesignationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
