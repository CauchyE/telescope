import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeysRoutingModule } from './keys-routing.module';
import { KeysComponent } from './keys.component';
import { KeyComponent } from './key/key.component';
import { CreateComponent } from './create/create.component';
import { SendComponent } from './key/send/send.component';
import { KeysModule } from '@view/keys/keys.module';
import { KeyModule } from '@view/keys/key/key.module';
import { CreateModule } from '@view/keys/create/create.module';
import { SendModule } from '@view/keys/key/send/send.module';

@NgModule({
  declarations: [KeysComponent, KeyComponent, CreateComponent, SendComponent],
  imports: [
    CommonModule,
    KeysRoutingModule,
    KeysModule,
    KeyModule,
    CreateModule,
    SendModule,
  ],
})
export class AppKeysModule {}
