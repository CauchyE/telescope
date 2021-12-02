import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { reducers, metaReducers } from './reducers';
import { TxFeeConfirmDialogModule } from './views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.module';
import { KeyBackupDialogModule } from './views/keys/key-backup-dialog/key-backup-dialog.module';
import { KeyDeleteConfirmDialogModule } from './views/keys/key-delete-confirm-dialog/key-delete-confirm-dialog.module';
import { KeyDeleteDialogModule } from './views/keys/key-delete-dialog/key-delete-dialog.module';
import { KeySelectDialogModule } from './views/keys/key-select-dialog/key-select-dialog.module';
import { ToolbarModule } from './views/toolbar/toolbar.module';
import { ViewModule } from './views/view.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingDialogModule } from 'ng-loading-dialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    LoadingDialogModule,
    MatDialogModule,
    MatSnackBarModule,
    ViewModule,
    ToolbarModule,
    HttpClientModule,
    KeySelectDialogModule,
    KeyBackupDialogModule,
    KeyDeleteDialogModule,
    KeyDeleteConfirmDialogModule,
    TxFeeConfirmDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
