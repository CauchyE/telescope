import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../view/material.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ClipboardModule,
  ],
  exports: [CreateComponent],
})
export class CreateModule { }
