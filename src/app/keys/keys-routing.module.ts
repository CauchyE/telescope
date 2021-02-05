import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeysComponent } from './keys.component';
import { KeyComponent } from './key/key.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  { path: '', component: KeysComponent },
  { path: 'create', component: CreateComponent },
  { path: ':key_id', component: KeyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeysRoutingModule {}
