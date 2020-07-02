import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HomeComponent } from './home/home.component';
import { ViewModule } from 'src/view/view.module';
import { HomeModule } from '@view/home/home.module';
import { ToolbarModule } from '@view/toolbar/toolbar.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HomeModule,
    ToolbarModule,
    ViewModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
