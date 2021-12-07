import { MaterialModule } from '../../views/material.module';
import { ToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule { }
