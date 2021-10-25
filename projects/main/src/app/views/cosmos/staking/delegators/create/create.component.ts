import { Key } from '../../../../../models/keys/key.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';

export type CreateOnSubmitEvent = {
  key: Key;
  validatorAddress: string;
  amount: proto.cosmos.base.v1beta1.ICoin;
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
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;

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
      privateKey,
    });
  }
}
