import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GovComponent } from './gov.component';
import { ProposalComponent } from './proposals/proposal/proposal.component';
import { ProposalsComponent } from './proposals/proposals.component';

const routes: Routes = [
  { path: '', component: GovComponent },
  { path: 'proposals',
   children: [
    { path: '', component: ProposalsComponent },
    { path: ':id', component: ProposalComponent},
   ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GovRoutingModule { }
