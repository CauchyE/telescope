import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeysRoutingModule } from './keys-routing.module';
import { KeysComponent } from './keys.component';
import { KeyComponent } from './key/key.component';
import { CreateComponent } from './create/create.component';
import { SendComponent } from './key/send/send.component';


@NgModule({
  declarations: [KeysComponent, KeyComponent, CreateComponent, SendComponent],
  imports: [
    CommonModule,
    KeysRoutingModule
  ]
})
export class KeysModule { }
