import { Key } from '../keys/key.model';
import { CreateValidatorData } from './staking.model';
import { StakingService } from './staking.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class StakingApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
    private readonly staking: StakingService,
  ) {}

  async createValidator(key: Key | undefined, createValidatorData: CreateValidatorData) {
    if (key === undefined) {
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      this.snackBar.open('Invalid key', undefined, { duration: 6000 });
      return;
    }

    const dialogRef = this.loadingDialog.open('Loading...');

    let createValidatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createValidatorResult = await this.staking.createValidator(key, createValidatorData);
      txHash = createValidatorResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully create validator', undefined, { duration: 6000 });

    await this.router.navigate(['txs', txHash]);
  }

  async createDelegator(
    key: Key,
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    privateKey: string,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string;

    try {
      txhash = await this.staking.createDelegator(key, validatorAddress, amount, privateKey);
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
