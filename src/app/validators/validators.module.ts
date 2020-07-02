import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidatorsRoutingModule } from './validators-routing.module';
import { ValidatorsViewModule } from '@view/validators/validators.module';
import { ValidatorsComponent } from './validators.component';
import { ValidatorComponent } from './validator/validator.component';

@NgModule({
  declarations: [ValidatorsComponent, ValidatorComponent],
  imports: [CommonModule, ValidatorsRoutingModule, ValidatorsViewModule],
})
export class AppValidatorsModule {}
