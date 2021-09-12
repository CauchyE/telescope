import { MaterialModule } from '../../views/material.module';
import { ToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, RouterModule, FormsModule, FlexLayoutModule, MaterialModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
