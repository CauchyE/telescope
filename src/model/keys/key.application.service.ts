import { Injectable } from '@angular/core';
import { LoadingDialogService } from 'ng-loading-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Coin } from 'cosmos-client/api';
import { Key, KeyType } from './key.model';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class KeyApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
    private readonly key: KeyService,
  ) {
    console.log('KeyApplicationService', router, snackBar, loadingDialog, key);
  }

  async create(id: string, type: KeyType, privateKey: string) {
    const key = await this.key.get(id);
    if (key !== undefined) {
      this.snackBar.open('ID is already used', undefined, {
        duration: 6000,
      });
      return;
    }

    const dialogRef = this.loadingDialog.open('Creating');
    try {
      await this.key.set(id, type, privateKey);
    } catch {
      this.snackBar.open('Error has occured', undefined, {
        duration: 6000,
      });
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully created', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['keys', id]);
  }

  async send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string;

    try {
      txhash = await this.key.send(key, toAddress, amount, privateKey);
    } catch {
      this.snackBar.open('Error has occured', undefined, {
        duration: 6000,
      });
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully sent', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['txs', txhash]);
  }
}