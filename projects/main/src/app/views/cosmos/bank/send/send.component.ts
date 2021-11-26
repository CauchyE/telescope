import { Key } from '../../../../models/keys/key.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { proto } from '@cosmos-client/core';

export type SendOnSubmitEvent = {
  key: Key;
  toAddress: string;
  coins: proto.cosmos.base.v1beta1.ICoin[];
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
  sentCoins?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit(toAddress: string, privateKey: string) {
    if (!this.sentCoins) {
      return;
    }
    this.appSubmit.emit({
      key: this.key!,
      toAddress,
      coins: this.sentCoins
        .filter((sentCoin) => {
          return Number(sentCoin.amount) > 0;
        })
        .map((sentCoin) => ({
          denom: sentCoin.denom,
          amount: sentCoin.amount?.toString(),
        })),
      privateKey,
    });
  }
}
