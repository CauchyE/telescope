import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovComponent } from './gov.component';
import { GovModule } from '../../../view/cosmos/gov/gov.module';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalsModule } from 'projects/cosmoscan/src/view/cosmos/gov/proposals/proposals.module';
import { GovRoutingModule } from './gov-routing.module';
import { ProposalComponent } from './proposals/proposal/proposal.component';
import { ProposalModule } from 'projects/cosmoscan/src/view/cosmos/gov/proposals/proposal/proposal.module';



@NgModule({
  declarations: [
    GovComponent, ProposalsComponent, ProposalComponent
  ],
  imports: [
    CommonModule, GovRoutingModule, GovModule, ProposalsModule, ProposalModule
  ],
})
export class AppGovModule { }
