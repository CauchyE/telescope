import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';

@Component({
  selector: 'view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnChanges {
  @Input()
  account?: proto.cosmos.auth.v1beta1.BaseAccount | unknown | null;

  @Input()
  balances?: proto.cosmos.base.v1beta1.ICoin[] | null;

  baseAccount?: proto.cosmos.auth.v1beta1.BaseAccount;
  vestingAccount?: proto.cosmos.vesting.v1beta1.ContinuousVestingAccount;
  publicKey?: string;

  txColumnKeys = ['height', 'txhash', 'timestamp', 'gas_wanted', 'gas_used'];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    delete this.baseAccount;

    if (this.account instanceof proto.cosmos.auth.v1beta1.BaseAccount) {
      this.baseAccount = this.account;
      // Todo: fix pub_key zero issue and convert bech32 format
      const publicKey = cosmosclient.codec.unpackAny(this.baseAccount.pub_key);
      if (!(publicKey instanceof proto.cosmos.crypto.secp256k1.PubKey)) {
        throw Error('Invalid public key!');
      }
      this.publicKey = Buffer.from(publicKey.key).toString('hex');
    } else if (this.account instanceof proto.cosmos.vesting.v1beta1.ContinuousVestingAccount) {
      this.vestingAccount = this.account;
      if (this.vestingAccount.base_vesting_account?.base_account === null) {
        throw Error('Invalid vesting account!');
      }
      this.baseAccount = new proto.cosmos.auth.v1beta1.BaseAccount(
        this.vestingAccount.base_vesting_account?.base_account,
      );
      // Todo: fix pub_key zero issue and convert bech32 format
      const publicKey = cosmosclient.codec.unpackAny(this.baseAccount.pub_key);
      if (!(publicKey instanceof proto.cosmos.crypto.secp256k1.PubKey)) {
        throw Error('Invalid public key!');
      }
      this.publicKey = Buffer.from(publicKey.key).toString('hex');
    }
  }
}
