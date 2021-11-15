import { MaterialModule } from '../../../material.module';
import { CreateValidatorComponent } from './create-validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateValidatorComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CreateValidatorComponent],
})
export class CreateValidatorModule {}
