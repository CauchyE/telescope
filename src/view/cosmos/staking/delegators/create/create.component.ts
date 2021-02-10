import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Key } from '@model/keys/key.model';
import { Coin } from 'cosmos-client/api';

export type CreateOnSubmitEvent = {
  key: Key;
  validatorAddress: string;
  amount: Coin;
  privateKey: string;
};

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Input()
  key?: Key | null;

  @Input()
  coins?: Coin[] | null;

  @Input()
  bondDenom?: string;

  @Output()
  appSubmit: EventEmitter<CreateOnSubmitEvent>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit(validatorAddress: string, amount: string, privateKey: string) {
    this.appSubmit.emit({
      key: this.key!,
      validatorAddress,
      amount: {
        amount,
        denom: this.bondDenom,
      },
      privateKey: privateKey,
    });
  }
}
