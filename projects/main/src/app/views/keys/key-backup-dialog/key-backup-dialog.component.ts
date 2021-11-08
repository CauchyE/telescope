import { KeyBackupResult } from '../../../models/keys/key.model';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-key-backup-dialog',
  templateUrl: './key-backup-dialog.component.html',
  styleUrls: ['./key-backup-dialog.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class KeyBackupDialogComponent implements OnInit {
  saved: boolean = false;
  checked: boolean = false;
  inputMnemonic: string = '';

  now = new Date();
  sec = this.now.getSeconds();
  requiredMnemonicNumber = this.sec % 12;
  private mnemonicArray = this.data.mnemonic.split(/\s/);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      mnemonic: string;
      privatekey: string;
      id: string;
    },
    public matDialogRef: MatDialogRef<KeyBackupDialogComponent>,
    private readonly snackBar: MatSnackBar,
  ) { }

  onClickSubmit(): void {
    const keyBackupResult: KeyBackupResult = { saved: this.saved, checked: this.checked };
    this.matDialogRef.close(keyBackupResult);
  }

  ordinal(n: number): string {
    if (n == 0) return '1st';
    if (n == 1) return '2nd';
    if (n == 2) return '3rd';
    return String(n + 1) + 'th';
  }

  saveMnemonic(): void {
    //postfix
    const year = String(this.now.getFullYear());
    const month = String(this.now.getMonth() + 1);
    const date = String(this.now.getDate());
    const hour = String(this.now.getHours());
    const min = String(this.now.getMinutes());
    const time = year + month + date + hour + min + String(this.sec);

    //filename
    const filetype = '.txt';
    const fileName = 'key-' + this.data.id + '-' + time + filetype;

    //data
    const data =
      'key ID : ' +
      this.data.id +
      '\n' +
      'private key : ' +
      this.data.privatekey +
      '\n' +
      'mnemonic : ' +
      this.data.mnemonic;

    //HTML link
    const link = document.createElement('a');
    link.href = 'data:text/plain,' + encodeURIComponent(data);
    link.download = fileName;
    link.click();

    //status
    this.saved = true;
  }

  checkSaveMnemonic(str: string): void {
    if (this.mnemonicArray[this.requiredMnemonicNumber] === str) {
      this.checked = true;
      this.snackBar.open('Collect', undefined, {
        duration: 2000,
      });
    } else {
      this.checked = false;
      this.snackBar.open('Wrong mnemonic', undefined, {
        duration: 1000,
      });
    }
  }

  ngOnInit(): void { }
}
