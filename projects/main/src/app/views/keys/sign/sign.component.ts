import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type SignOnSignEvent = {
  data: string;
  privateKey: string;
};

@Component({
  selector: 'view-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
})
export class SignComponent implements OnInit {
  @Input()
  data?: string | null;

  @Input()
  signature?: string | null;

  @Output()
  appSign: EventEmitter<SignOnSignEvent>;

  constructor() {
    this.appSign = new EventEmitter();
  }

  ngOnInit(): void { }

  onClickButton(data: string, privateKey: string) {
    this.appSign.emit({
      data,
      privateKey,
    });
  }
}
