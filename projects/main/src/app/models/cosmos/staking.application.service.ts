import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { Key } from '../keys/key.model';
import { CreateValidatorData } from './staking.model';
import { StakingService } from './staking.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly staking: StakingService,
  ) {}

  async createValidator(
    key: Key | undefined,
    createValidatorData: CreateValidatorData,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
  ) {
    if (key === undefined) {
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      this.snackBar.open('Invalid key', undefined, { duration: 6000 });
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.staking.simulateToCreateValidator(
        key,
        createValidatorData,
        minimumGasPrice,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // ask the user to confirm the fee with a dialog
    const txFeeConfirmedResult = await this.dialog
      .open(TxFeeConfirmDialogComponent, {
        data: {
          fee,
          isConfirmed: false,
        },
      })
      .afterClosed()
      .toPromise();

    if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
      this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
      return;
    }

    const dialogRef = this.loadingDialog.open('Loading...');

    let createValidatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createValidatorResult = await this.staking.createValidator(
        key,
        createValidatorData,
        gas,
        fee,
      );
      txHash = createValidatorResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, undefined, { duration: 6000 });
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
