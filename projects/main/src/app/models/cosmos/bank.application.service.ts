import { Key } from '../keys/key.model';
import { BankService } from './bank.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { proto } from '@cosmos-client/core';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class BankApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
    private readonly bank: BankService,
  ) {}

  async send(
    key: Key,
    toAddress: string,
    coins: proto.cosmos.base.v1beta1.ICoin[],
    privateKey: string,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string | undefined;

    try {
      const res = await this.bank.send(key, toAddress, coins, privateKey);
      txhash = res.tx_response?.txhash;
      if (txhash === undefined) {
        throw Error('Invalid txhash!');
      }
    } catch (error) {
      const msg = (error as Error).toString();
      this.snackBar.open(`Error has occured: ${msg}`, undefined, {
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
