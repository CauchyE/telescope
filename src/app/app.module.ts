import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HomeComponent } from './home/home.component';
import { ValidatorsComponent } from './validators/validators.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { TxComponent } from './txs/tx/tx.component';
import { AccountComponent } from './accounts/account/account.component';
import { MaterialModule } from 'src/view/material.module';
import { ViewModule } from 'src/view/view.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ValidatorsComponent,
    ValidatorComponent,
    TxComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ViewModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
