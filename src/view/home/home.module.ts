export class HomesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component'
import { MaterialModule } from '@view/material.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MaterialModule],
  exports: [HomeComponent]
})
export class HomeModule { }
