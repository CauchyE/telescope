import { Component, OnInit } from '@angular/core';
import { CosmosSDKService } from '@model/cosmos-sdk.service';
import { CreateOnSubmitEvent } from '@view/keys/create/create.component';
import { KeyApplicationService } from '@model/keys/key.application.service';
import { KeyService } from '@model/keys/key.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  privateKey: string;

  constructor(
    private readonly cosmosSDK: CosmosSDKService,
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
    await this.keyApplication.create($event.id, $event.privateKey);
  }
}
