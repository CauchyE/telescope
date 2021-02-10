import { Component, OnInit } from '@angular/core';
import { CreateOnSubmitEvent } from '@view/keys/create/create.component';
import { KeyService, KeyApplicationService } from '@model/index';
import * as bip39 from 'bip39';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  privateKey: string;
  mnemonic: string;

  constructor(
    private readonly keyApplication: KeyApplicationService,
    private readonly key: KeyService,
  ) {
    this.privateKey = '';
    this.mnemonic = '';
  }

  ngOnInit(): void {}

  onClickCreateMnemonic() {
    this.mnemonic = bip39.generateMnemonic();
    window.alert('You must memory this mnemonic.');
  }

  async onBlurMnemonic(mnemonic: string) {
    if (!mnemonic) {
      return;
    }
    this.privateKey = await this.key.getPrivateKeyFromMnemonic(mnemonic);
  }

  async onSubmit($event: CreateOnSubmitEvent) {
    await this.keyApplication.create($event.id, $event.type, $event.privateKey);
  }
}
