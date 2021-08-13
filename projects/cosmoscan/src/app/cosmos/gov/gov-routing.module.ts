import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GovComponent } from './gov.component';
import { ProposalsComponent } from './proposals/proposals.component';

const routes: Routes = [
  { path: '', component: GovComponent },
  { path: 'proposals', component: ProposalsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GovRoutingModule { }
