import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from '@view/material.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ToolbarComponent],
})
export class ToolbarsViewModule { }

