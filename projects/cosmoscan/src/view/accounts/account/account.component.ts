import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cosmos } from 'cosmos-client';

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

  baseAccount?: cosmos.auth.v1beta1.BaseAccount

  txColumnKeys = ['height', 'txhash', 'timestamp', 'gas_wanted', 'gas_used'];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    delete this.baseAccount;

    if (this.account instanceof cosmos.auth.v1beta1.BaseAccount) {
      this.baseAccount = this.account
    }
  }
}
