import { FaucetComponent } from './faucet.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaxModule, MinModule } from 'ng-min-max';
import { MaterialModule } from 'projects/main/src/app/views/material.module';

@NgModule({
  declarations: [FaucetComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MinModule,
    MaxModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [FaucetComponent],
})
export class FaucetModule {}
