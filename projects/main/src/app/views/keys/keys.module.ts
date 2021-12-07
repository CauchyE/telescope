import { MaterialModule } from '../../views/material.module';
import { KeysComponent } from './keys.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [KeysComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [KeysComponent],
})
export class KeysModule { }
