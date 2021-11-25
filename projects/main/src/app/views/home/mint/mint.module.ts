import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [
    MintComponent
  ],
  imports: [
    CommonModule, RouterModule, MaterialModule
  ],
  exports: [
    MintComponent
  ],
})
export class MintModule { }
