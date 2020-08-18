import { Component, OnInit } from '@angular/core';
import { CosmosSDKService } from '@model/cosmos-sdk.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  privateKey: string;

  constructor(private readonly cosmosSDK: CosmosSDKService) {
    this.privateKey = '';
  }

  ngOnInit(): void {}

  async onMnemonic(mnemonic: string) {
    this.privateKey = (
      await this.cosmosSDK.sdk.generatePrivKeyFromMnemonic(mnemonic)
    ).toString('hex');
  }
}
