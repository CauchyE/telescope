import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-key-backup-dialog',
  templateUrl: './key-backup-dialog.component.html',
  styleUrls: ['./key-backup-dialog.component.css']
})
export class KeyBackupDialogComponent implements OnInit {

  checked: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    /*Todo：何か受け取る必要があるか検討。
    public readonly data: {
      keys: Key[];
      currentKeyID: string | undefined;
    },
    */
    public matDialogRef: MatDialogRef<KeyBackupDialogComponent>
  ) { }

  onClickOkButton(): void {
    // ボタンが押されたときは「checked」を呼び出し元に渡す。
    //Todo:渡した「checked」を判断に使用する。
    this.matDialogRef.close(this.checked);
  }

  ngOnInit(): void {
  }

}

