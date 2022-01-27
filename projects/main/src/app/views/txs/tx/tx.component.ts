import { Component, OnInit, Input } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  @Input()
  tx?: CosmosTxV1beta1GetTxResponse | null;

  constructor() {}

  ngOnInit(): void {}

  unpackMsg(value: any) {
    try {
      return cosmosclient.codec.unpackCosmosAny(value);
    } catch {
      return null;
    }
  }

  unpackKey(value: any) {
    try {
      return cosmosclient.codec.unpackCosmosAny(value) as cosmosclient.PubKey;
    } catch {
      return null;
    }
  }

  constructorName(instance: any) {
    return instance.constructor.name;
  }

  entries(value: unknown) {
    return Object.entries(value as any);
  }

  getPublicKey(pubkey: any): string {
    const publicKey = new proto.cosmos.crypto.secp256k1.PubKey({
      key: pubkey.key,
    });
    return cosmosclient.AccAddress.fromPublicKey(publicKey).toString();
  }
}
