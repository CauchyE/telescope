import { MaterialModule } from '../../../../views/material.module';
import { SendComponent } from './send.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MinModule } from 'ng-min-max';

@NgModule({
  declarations: [SendComponent],
  imports: [CommonModule, RouterModule, FormsModule, FlexLayoutModule, MaterialModule, MinModule],
  exports: [SendComponent],
})
export class SendModule {}
