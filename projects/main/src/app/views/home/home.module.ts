import { MaterialModule } from '../../views/material.module';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [HomeComponent],
})
export class HomeModule { }
