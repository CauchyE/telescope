import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadingDialogModule } from 'ng-loading-dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HomeComponent } from './home/home.component';
import { ViewModule } from '../view/view.module';
import { HomeModule } from '../view/home/home.module';
import { ToolbarModule } from '../view/toolbar/toolbar.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { KeySelectDialogModule } from '../view/keys/key-select-dialog/key-select-dialog.module';
import { BlocksComponent } from './home/blocks/blocks.component';
import { BlocksModule } from '../view/home/blocks/blocks.module';
import { TxsComponent } from './home/txs/txs.component';
import { TxsModule } from '../view/home/txs/txs.module';
import { BankComponent } from './home/bank/bank.component';
import { BankModule } from '../view/home/bank/bank.module';
import { MintComponent } from './home/mint/mint.component';
import { MintModule } from '../view/home/mint/mint.module';
import { DistributionComponent } from './home/distribution/distribution.component';
import { DistributionModule } from '../view/home/distribution/distribution.module';


@NgModule({
  declarations: [AppComponent, HomeComponent, BlocksComponent, TxsComponent, BankComponent, MintComponent, DistributionComponent],
  imports: [
    BrowserModule,
    LoadingDialogModule,
    MatDialogModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    ViewModule,
    HomeModule,
    ToolbarModule,
    HttpClientModule,
    KeySelectDialogModule,
    BlocksModule,
    TxsModule,
    BankModule,
    MintModule,
    DistributionModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
