import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './app/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { AppComponent } from './app/app.component';

@NgModule({
  declarations: [AppComponent, ToolbarComponent],
  imports: [CommonModule, FormsModule, FlexLayoutModule, MaterialModule],
  exports: [AppComponent, ToolbarComponent],
})
export class ViewModule {}
