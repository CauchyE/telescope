import { KeySelectGuard } from '../../models/keys/key-select.guard';
import { CreateComponent } from './create/create.component';
import { GentxComponent } from './gentx/gentx.component';
import { KeyComponent } from './key/key.component';
import { KeysComponent } from './keys.component';
import { SignComponent } from './sign/sign.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: KeysComponent },
  { path: 'create', component: CreateComponent },
  { path: 'sign', component: SignComponent },
  { path: 'gentx', component: GentxComponent, canActivate: [KeySelectGuard] },
  { path: ':key_id', component: KeyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeysRoutingModule {}
