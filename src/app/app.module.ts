import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";

import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { ValidatorsComponent } from './validators/validators.component';
import { ValidatorComponent } from './validators/validator/validator.component';
import { DesignatedModule } from './designated/designated.module';
import { UndesignatedModule } from './undesignated/undesignated.module';
import { TxComponent } from './txs/tx/tx.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ValidatorsComponent,
    ValidatorComponent,
    TxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    SharedModule,
    DesignatedModule,
    UndesignatedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
