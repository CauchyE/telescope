import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [ToolbarComponent, HomeComponent],
  imports: [CommonModule],
  exports: [HomeComponent, ToolbarComponent]
})
export class UndesignatedModule {}
