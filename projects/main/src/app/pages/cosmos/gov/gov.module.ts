import { GovModule } from '../../../views/cosmos/gov/gov.module';
import { GovRoutingModule } from './gov-routing.module';
import { GovComponent } from './gov.component';
import { ProposalComponent } from './proposals/proposal/proposal.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProposalModule } from 'projects/main/src/view/cosmos/gov/proposals/proposal/proposal.module';
import { ProposalsModule } from 'projects/main/src/view/cosmos/gov/proposals/proposals.module';

@NgModule({
  declarations: [GovComponent, ProposalsComponent, ProposalComponent],
  imports: [CommonModule, GovRoutingModule, GovModule, ProposalsModule, ProposalModule],
})
export class AppGovModule {}
