import { Key } from '../../../../models/keys/key.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { proto } from '@cosmos-client/core';

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

  @Input()
  amounts?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit(toAddress: string, privateKey: string) {
    if (!this.amounts) {
      return;
    }
    this.appSubmit.emit({
      key: this.key!,
      toAddress,
      amount: this.amounts
        .filter((value) => {
          return Number(value.amount) > 0;
        })
        .map((value) => ({
          denom: value.denom,
          amount: value.amount?.toString(),
        })),
      privateKey,
    });
  }
}
