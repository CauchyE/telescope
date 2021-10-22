import { MaterialModule } from '../../material.module';
import { GentxComponent } from './gentx.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GentxComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [GentxComponent],
})
export class GentxModule {}
