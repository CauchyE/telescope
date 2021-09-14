import { MaterialModule } from '../../../../../views/material.module';
import { ProposalComponent } from './proposal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProposalComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [ProposalComponent],
})
export class ProposalModule {}
