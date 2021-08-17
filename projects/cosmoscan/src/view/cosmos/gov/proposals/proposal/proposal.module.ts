import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalComponent } from './proposal.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../../../view/material.module';


@NgModule({
  declarations: [
    ProposalComponent
  ],
  imports: [
    CommonModule, RouterModule, FlexLayoutModule, MaterialModule
  ],
  exports: [
    ProposalComponent
  ]
})
export class ProposalModule { }
