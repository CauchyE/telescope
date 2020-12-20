import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyType } from '@model/keys/key.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

export type CreateOnSubmitEvent = {
  id: string;
  type: KeyType;
  privateKey: string;
};

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Input()
  privateKey?: string | null;

  @Output()
  appMnemonic: EventEmitter<string>;

  @Output()
  appSubmit: EventEmitter<CreateOnSubmitEvent>;

  isPasswordVisible: boolean = false;

  constructor(
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
  ) {
    this.appMnemonic = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onBlurMnemonic(mnemonic: string) {
    this.appMnemonic.next(mnemonic);
  }

  onSubmit(id: string, type: KeyType, privateKey: string) {
    this.isPasswordVisible = false;
    this.appSubmit.emit({ id, type, privateKey });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    return false;
  }

  copyPrivateKey(privateKey: string) {
    if (privateKey.length > 0) {
      this.clipboard.copy(privateKey);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }

    return false;
  }
}