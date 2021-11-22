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
    amount: proto.cosmos.base.v1beta1.ICoin[],
    privateKey: string,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string;

    try {
      const res: any = await this.bank.send(key, toAddress, amount, privateKey);
      if (res.data.tx_response.code !== 0 && res.data.tx_response.raw_log !== undefined) {
        throw new Error(res.data.tx_response.raw_log);
      }
      txhash = res.data.tx_response.txhash;
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
