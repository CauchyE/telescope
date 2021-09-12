import { Key } from '../../../../app/models/keys/key.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { proto } from 'cosmos-client';

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
}
