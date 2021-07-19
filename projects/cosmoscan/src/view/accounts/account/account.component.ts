import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cosmos, cosmosclient } from 'cosmos-client';

@Component({
  selector: 'view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnChanges {
  @Input()
  account?: cosmos.auth.v1beta1.BaseAccount | unknown | null;

  @Input()
  balances?: cosmos.base.v1beta1.ICoin[] | null;

  baseAccount?: cosmos.auth.v1beta1.BaseAccount;

  publicKey?: string;

  txColumnKeys = ['height', 'txhash', 'timestamp', 'gas_wanted', 'gas_used'];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    delete this.baseAccount;

    if (this.account instanceof cosmos.auth.v1beta1.BaseAccount) {
      this.baseAccount = this.account;
      // Todo: fix pub_key zero issue
      console.log(cosmosclient.codec.unpackAny(this.baseAccount.pub_key));
      const publicKey = cosmosclient.codec.unpackAny(this.baseAccount.pub_key);

      if (!(publicKey instanceof cosmos.crypto.secp256k1.PubKey)) {
        throw Error('hoge');
      }
      this.publicKey = Buffer.from(publicKey.key).toString('hex');
      console.log(this.publicKey);
    }
  }
}
