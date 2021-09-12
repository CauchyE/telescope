import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cosmosclient, proto } from 'cosmos-client';
import { InlineResponse20063Validator } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit, OnChanges {
  @Input()
  validator?: InlineResponse20063Validator | null;

  publicKey?: string;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    const pubKey = cosmosclient.codec.unpackCosmosAny(this.validator?.consensus_pubkey);

    if (!(pubKey instanceof proto.cosmos.crypto.ed25519.PubKey)) {
      return;
    }
    this.publicKey = Buffer.from(pubKey.key).toString('hex');
  }
}
