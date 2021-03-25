import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Key } from '../keys/key.model';
import { cosmos } from 'cosmos-client';
import { LoadingDialogService } from 'ng-loading-dialog';
import { StakingService } from './staking.service';

@Injectable({
  providedIn: 'root',
})
export class StakingApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
    private readonly staking: StakingService,
  ) { }

  async createDelegator(
    key: Key,
    validatorAddress: string,
    amount: cosmos.base.v1beta1.ICoin,
    privateKey: string,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string;

    try {
      txhash = await this.staking.createDelegator(
        key,
        validatorAddress,
        amount,
        privateKey,
      );
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
