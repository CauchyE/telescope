import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BlocksComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [BlocksComponent]
})
export class BlocksModule { }
