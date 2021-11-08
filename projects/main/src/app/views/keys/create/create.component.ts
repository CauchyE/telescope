import { KeyType } from '../../../models/keys/key.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type CreateOnSubmitEvent = {
  id: string;
  type: KeyType;
  privateKey: string;
  mnemonic: string;
};

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Input()
  mnemonic?: string | null;

  @Input()
  privateKey?: string | null;

  @Output()
  appClickCreateMnemonic: EventEmitter<string>;

  @Output()
  appBlurMnemonic: EventEmitter<string>;

  @Output()
  appSubmit: EventEmitter<CreateOnSubmitEvent>;

  isPasswordVisible: boolean = false;

  constructor(private clipboard: Clipboard, private readonly snackBar: MatSnackBar) {
    this.appClickCreateMnemonic = new EventEmitter();
    this.appBlurMnemonic = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void { }

  onClickCreateMnemonic() {
    this.appClickCreateMnemonic.emit();
  }

  onBlurMnemonic(mnemonic: string) {
    this.appBlurMnemonic.next(mnemonic);
  }

  onSubmit(id: string, type: KeyType, privateKey: string, mnemonic: string) {
    this.isPasswordVisible = false;
    this.appSubmit.emit({ id, type, privateKey, mnemonic });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    return false;
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }

    return false;
  }
}
