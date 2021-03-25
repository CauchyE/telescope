import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Key } from '../../../../../model/keys/key.model';
import { cosmos } from 'cosmos-client';

export type CreateOnSubmitEvent = {
  key: Key;
  validatorAddress: string;
  amount: cosmos.base.v1beta1.ICoin;
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
  coins?: cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  bondDenom?: string;

  @Output()
  appSubmit: EventEmitter<CreateOnSubmitEvent>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void { }

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
