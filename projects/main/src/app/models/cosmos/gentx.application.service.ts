import { CosmosSDKService } from '../cosmos-sdk.service';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';

@Injectable({
  providedIn: 'root',
})
export class GentxApplicationService {
  constructor(private readonly cosmosSDK: CosmosSDKService, private readonly key: KeyService) {}

  // Todo: WIP
  async gentx(key: Key, privateKey: string): Promise<void> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const privKey = this.key.getPrivKey(key.type, privateKey);
    const pubKey = privKey.pubKey();
  }
}
