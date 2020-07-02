import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidatorsRoutingModule } from './validators-routing.module';
import { ValidatorsViewModule } from '@view/validators/validators.module';
import { ValidatorsComponent } from './validators.component';
import { ValidatorComponent } from './validator/validator.component';
import { ValidatorModule } from '@view/validators/validator/validator.module';

@NgModule({
  declarations: [ValidatorsComponent, ValidatorComponent],
  imports: [CommonModule, ValidatorsRoutingModule, ValidatorsViewModule, ValidatorModule],
})
export class AppValidatorsModule { }
