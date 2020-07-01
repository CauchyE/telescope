import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { ToolbarModule } from './toolbar/toolbar.module';
// import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '@app/home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  // declarations: [AppComponent, HomeModule, ToolbarModule],
  // declarations: [AppComponent, HomeComponent, ToolbarComponent],
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [AppComponent],
})
export class ViewModule { }