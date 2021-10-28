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

  checked: boolean = false;
  saved: boolean = false;

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
    console.log("create-dialog,saved", input)
    this.matDialogRef.close(this.checked);
  }

  saveMnemonic(): void {

    //prefix
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1);
    const date = String(now.getDate());
    const hour = String(now.getHours());
    const min = String(now.getMinutes());
    const sec = String(now.getSeconds());
    const time = year + month + date + hour + min + sec;

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
  }

  ngOnInit(): void {
  }

}

