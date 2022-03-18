import { KeyType } from '../../../models/keys/key.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ImportOnSubmitEvent = {
  id: string;
  type: KeyType;
  privateKey: string;
  mnemonic: string;
};

@Component({
  selector: 'view-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent implements OnInit {
  @Input()
  mnemonic?: string | null;

  @Input()
  privateKey?: string | null;

  @Output()
  appBlurMnemonic: EventEmitter<string>;

  @Output()
  appSubmit: EventEmitter<ImportOnSubmitEvent>;

  isPasswordVisible: boolean = false;

  constructor(private clipboard: Clipboard, private readonly snackBar: MatSnackBar) {
    this.appBlurMnemonic = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

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
