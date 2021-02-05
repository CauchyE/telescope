import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeysRoutingModule } from './keys-routing.module';
import { KeysComponent } from './keys.component';
import { KeyComponent } from './key/key.component';
import { CreateComponent } from './create/create.component';
import { KeysModule } from '@view/keys/keys.module';
import { KeyModule } from '@view/keys/key/key.module';
import { CreateModule } from '@view/keys/create/create.module';

@NgModule({
  declarations: [KeysComponent, KeyComponent, CreateComponent],
  imports: [
    CommonModule,
    KeysRoutingModule,
    KeysModule,
    KeyModule,
    CreateModule,
  ],
})
export class AppKeysModule {}
