import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KeyBackupDialogComponent } from '../../views/keys/key-backup-dialog/key-backup-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class KeyBackupDialogService {

  constructor(
    public matDialog: MatDialog,
    private readonly dialog: MatDialog,
  ) { }

  async open(): Promise<boolean | undefined> {

    const result: boolean | undefined = await this.dialog
      .open(KeyBackupDialogComponent, {
        //Todo：ダイアログに何か渡す必要があるか検討。
        //data: { keys, currentKeyID: currentKey?.id },
      })
      .afterClosed()
      .toPromise();

    //Todo:現在は閉じたら、0を返す。
    //     返ってくる「checked」を判断に使用する。
    return result;
  }

}
