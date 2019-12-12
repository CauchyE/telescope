import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [HomeComponent, ToolbarComponent],
  imports: [
    CommonModule
  ]
})
export class DesignatedModule { }
