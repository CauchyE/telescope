import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-key-backup-dialog',
  templateUrl: './key-backup-dialog.component.html',
  styleUrls: ['./key-backup-dialog.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class KeyBackupDialogComponent implements OnInit {

  saved: boolean = false;
  checked: boolean = false;
  inputMnemonic: string = "";

  now = new Date();
  sec = this.now.getSeconds();
  requiredMnemonicNumber = this.sec % 12

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      mnemonic: string,
      privatekey: string
    },
    public matDialogRef: MatDialogRef<KeyBackupDialogComponent>,
  ) { }

  onClickOkButton(input: boolean): void {
    // ボタンが押されたときは「checked」を呼び出し元に渡す。
    //Todo:渡した「checked」を判断に使用する。
    this.matDialogRef.close(this.checked);
  }

  ordinal(n: number): string {
    if (n == 0) return "1st"
    if (n == 1) return "2nd"
    if (n == 2) return "3rd"
    return String(n + 1) + "th"
  }

  saveMnemonic(): void {
    //prefix
    const year = String(this.now.getFullYear());
    const month = String(this.now.getMonth() + 1);
    const date = String(this.now.getDate());
    const hour = String(this.now.getHours());
    const min = String(this.now.getMinutes());
    const time = year + month + date + hour + min + String(this.sec);

    //filename
    const filetype = '.txt';
    const fileName = "key" + time + filetype;

    //data
    const data = "private key : " + this.data.privatekey + "\n"
      + "mnemonic : " + this.data.mnemonic;

    //HTML link
    const link = document.createElement('a');
    link.href = 'data:text/plain,' + encodeURIComponent(data);
    link.download = fileName;
    link.click();

    //status
    this.saved = true;
  }

  private mnemonicArray = this.data.mnemonic.split(/\s/)

  checkSaveMnemonic(str: string): void {
    if (this.mnemonicArray[this.requiredMnemonicNumber] === str) {
      this.checked = true;
    }
  }

  ngOnInit(): void {
  }

}

