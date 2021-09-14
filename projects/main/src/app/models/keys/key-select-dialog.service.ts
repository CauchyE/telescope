import { KeySelectDialogComponent } from '../../views/keys/key-select-dialog/key-select-dialog.component';
import { Key } from './key.model';
import { KeyService } from './key.service';
import { KeyStoreService } from './key.store.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KeySelectDialogService {
  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
  ) {}

  async open() {
    const keys = await this.key.list();
    const currentKey = await this.keyStore.currentKey$.pipe(first()).toPromise();

    const result: Key | undefined = await this.dialog
      .open(KeySelectDialogComponent, {
        data: { keys, currentKeyID: currentKey?.id },
      })
      .afterClosed()
      .toPromise();

    if (!result || result.id === currentKey?.id) {
      return result;
    }
    this.keyStore.setCurrentKey(result);
    return result;
  }
}
