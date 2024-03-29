import { Key } from '../../../../models/keys/key.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { proto } from '@cosmos-client/core';

export type SendOnSubmitEvent = {
  key: Key;
  toAddress: string;
  amount: proto.cosmos.base.v1beta1.ICoin[];
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  privateKey: Uint8Array;
  coins: proto.cosmos.base.v1beta1.ICoin[];
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
  amount?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[];

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void { }

  onSubmit(toAddress: string, privateKeyString: string, minimumGasPrice: string) {
    if (!this.amount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.selectedGasPrice.amount = minimumGasPrice.toString();

    const privateKeyWithNoWhitespace = privateKeyString.replace(/\s+/g, '');
    const privateKeyBuffer = Buffer.from(privateKeyWithNoWhitespace, 'hex')
    const privateKey = Uint8Array.from(privateKeyBuffer)

    this.appSubmit.emit({
      key: this.key!,
      toAddress,
      amount: this.amount
        .filter((coin) => {
          return Number(coin.amount) > 0;
        })
        .map((coin) => ({
          denom: coin.denom,
          amount: coin.amount?.toString(),
        })),
      minimumGasPrice: this.selectedGasPrice,
      privateKey,
      coins: this.coins!,
    });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.selectedGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.selectedGasPrice) {
      this.selectedGasPrice.amount = amount;
    }
  }
}
