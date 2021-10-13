import { FaucetRoutingModule } from './faucet-routing.module';
import { FaucetComponent } from './faucet.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FaucetModule } from 'projects/main/src/app/views/faucet/faucet.module';
import { MaterialModule } from 'projects/main/src/app/views/material.module';

@NgModule({
  declarations: [FaucetComponent],
  imports: [CommonModule, FaucetRoutingModule, MaterialModule, HttpClientModule, FaucetModule],
})
export class AppFaucetModule {}
