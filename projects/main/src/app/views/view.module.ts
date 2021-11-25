import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ToolbarModule
  ],
  exports: [AppComponent],
})
export class ViewModule { }
