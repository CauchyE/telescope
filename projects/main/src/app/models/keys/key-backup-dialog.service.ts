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

  async open(mnemonic: string, privatekey: string): Promise<boolean | undefined> {

    const result: boolean = await this.dialog
      .open(KeyBackupDialogComponent, {
        data: { mnemonic: mnemonic, privatekey: privatekey },
      })
      .afterClosed()
      .toPromise();

    return result;
  }

}
