import { Injectable } from '@angular/core';
import { LoadingDialogService } from 'ng-loading-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Coin } from 'cosmos-client/api';
import { Key } from './key.model';
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
  ) {}

  async create(id: string, privateKey: string) {}

  async send(key: Key, toAddress: string, amount: Coin[], privateKey: string) {
    let dialogRef = this.loadingDialog.open('Sending');

    try {
      await this.key.send(key, toAddress, amount, privateKey);
    } catch {
      this.snackBar.open('Error has occured', undefined, {
        duration: 6000,
      });
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('送信しました', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['']);
  }
}
