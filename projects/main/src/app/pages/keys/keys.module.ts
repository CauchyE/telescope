import { CreateModule } from '../../views/keys/create/create.module';
import { GentxModule } from '../../views/keys/gentx/gentx.module';
import { KeyModule } from '../../views/keys/key/key.module';
import { KeysModule } from '../../views/keys/keys.module';
import { SignModule } from '../../views/keys/sign/sign.module';
import { CreateComponent } from './create/create.component';
import { GentxComponent } from './gentx/gentx.component';
import { KeyComponent } from './key/key.component';
import { KeysRoutingModule } from './keys-routing.module';
import { KeysComponent } from './keys.component';
import { SignComponent } from './sign/sign.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [KeysComponent, KeyComponent, CreateComponent, SignComponent, GentxComponent],
  imports: [
    CommonModule,
    KeysRoutingModule,
    KeysModule,
    KeyModule,
    CreateModule,
    SignModule,
    GentxModule,
  ],
})
export class AppKeysModule {}
