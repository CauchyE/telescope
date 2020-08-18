import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeysComponent } from './keys.component';
import { KeyComponent } from './key/key.component';
import { CreateComponent } from './create/create.component';
import { SendComponent } from './key/send/send.component';

const routes: Routes = [
  { path: '', component: KeysComponent },
  { path: 'create', component: CreateComponent },
  { path: ':key_id', component: KeyComponent },
  { path: ':key_id/send', component: SendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeysRoutingModule {}
