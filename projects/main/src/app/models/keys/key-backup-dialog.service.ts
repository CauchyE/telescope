import { KeyBackupDialogComponent } from '../../views/keys/key-backup-dialog/key-backup-dialog.component';
import { KeyCreateResult } from './key.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class KeyBackupDialogService {
  constructor(public matDialog: MatDialog, private readonly dialog: MatDialog) {}

  async open(
    mnemonic: string,
    privatekey: string,
    id: string,
  ): Promise<KeyCreateResult | undefined> {
    const result: KeyCreateResult = await this.dialog
      .open(KeyBackupDialogComponent, {
        data: { mnemonic: mnemonic, privatekey: privatekey, id: id },
      })
      .afterClosed()
      .toPromise();

    return result;
  }
}
