import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type SignOnSignEvent = {
  data: string;
  privateKey: Uint8Array;
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

  onClickButton(data: string, privateKeyString: string) {

    const privateKeyWithNoWhitespace = privateKeyString.replace(/\s+/g, '');
    const privateKeyBuffer = Buffer.from(privateKeyWithNoWhitespace, 'hex')
    const privateKey = Uint8Array.from(privateKeyBuffer)

    this.appSign.emit({
      data,
      privateKey,
    });
  }
}
