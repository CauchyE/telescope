import { MaterialModule } from '../../../../../views/material.module';
import { CreateComponent } from './create.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MinModule } from 'ng-min-max';

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, MinModule],
  exports: [CreateComponent],
})
export class CreateModule { }
