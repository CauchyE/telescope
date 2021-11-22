import { Key } from '../../../../models/keys/key.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { proto } from '@cosmos-client/core';

interface Denom {
  value: string;
  viewValue: string;
}

export type SendOnSubmitEvent = {
  key: Key;
  toAddress: string;
  amount: proto.cosmos.base.v1beta1.ICoin[];
  privateKey: string;
};

@Component({
  selector: 'view-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  @Input()
  key?: Key | null;

  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  amount: proto.cosmos.base.v1beta1.ICoin[];

  constructor() {
    this.appSubmit = new EventEmitter();
    this.amount = [{ denom: '', amount: '' }];
  }

  ngOnInit(): void {}

  removeAmount(index: number) {
    this.amount.splice(index, 1);
    return false;
  }

  addAmount() {
    this.amount.push({});
    return false;
  }

  onSubmit(toAddress: string, privateKey: string) {
    this.appSubmit.emit({
      key: this.key!,
      toAddress,
      amount: this.amount.map((data) => ({
        denom: data.denom,
        amount: data.amount?.toString(),
      })),
      privateKey,
    });
  }

  tokens: Denom[] = [
    { value: 'jpyx', viewValue: 'JPYX: JPY Stable Coin' },
    { value: 'ujpyx', viewValue: 'uJPYX: 10^(-6) JPYX' },
    { value: 'btc', viewValue: 'BTC: Bitcoin' },
    { value: 'ubtc', viewValue: 'uBTC: 10^(-6) BTC' },
    { value: 'jcbn', viewValue: 'JCBN: Governance Token for JPYX' },
    { value: 'ujcbn', viewValue: 'uJCBN: 10^(-6) JCBN' },
  ];
}
