import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [BlocksComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [BlocksComponent],
})
export class BlocksModule { }
