import { KeyDeleteDialogComponent } from '../../views/keys/key-delete-dialog/key-delete-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class KeyDeleteDialogService {
  constructor(private readonly dialog: MatDialog) {}

  openKeyDeleteDialog(id: string) {
    return this.dialog
      .open(KeyDeleteDialogComponent, {
        data: { id: id },
      })
      .afterClosed();
  }
}
