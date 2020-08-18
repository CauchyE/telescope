import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Coin } from 'cosmos-client/api';
import { Key } from '@model/keys/key.model';

export type SendOnSubmitEvent = {
  key: Key;
  toAddress: string;
  amount: Coin[];
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
  coins?: Coin[] | null;

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.appSubmit.emit({
      key: this.key!,
      toAddress: '', //todo
      amount: [], //todo
      privateKey: '', //todo
    });
  }
}
