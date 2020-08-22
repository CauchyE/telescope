import { Component, OnInit } from '@angular/core';
import { CreateOnSubmitEvent } from '@view/keys/create/create.component';
import { KeyService, KeyApplicationService } from '@model/index';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  privateKey: string;

  constructor(
    private readonly keyApplication: KeyApplicationService,
    private readonly key: KeyService,
  ) {
    this.privateKey = '';
  }

  ngOnInit(): void {}

  async onMnemonic(mnemonic: string) {
    this.privateKey = await this.key.getPrivateKeyFromMnemonic(mnemonic);
  }

  async onSubmit($event: CreateOnSubmitEvent) {
    await this.keyApplication.create($event.id, $event.type, $event.privateKey);
  }
}
