import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { Key } from '../keys/key.model';
import { KeyService } from '../keys/key.service';
import { BankService } from './bank.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly bank: BankService,
    private readonly key: KeyService,
  ) { }

  async send(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    privateKey: Uint8Array,
    coins: proto.cosmos.base.v1beta1.ICoin[],
  ) {
    if (!(await this.key.validatePrivKey(key, privateKey))) {
      this.snackBar.open(`Invalid private key.`, 'Close');
      return;
    }
    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    // confirm whether amount has fee for simulation
    const feeDenom = minimumGasPrice.denom;
    const simulationFeeAmount = 1;
    const tempAmountToSend = amount.find(
      (amount) => amount.denom === minimumGasPrice.denom,
    )?.amount;
    const amountToSend = tempAmountToSend ? parseInt(tempAmountToSend) : 0;
    const tempBalance = coins.find((coin) => coin.denom === minimumGasPrice.denom)?.amount;
    const balance = tempBalance ? parseInt(tempBalance) : 0;
    if (amountToSend + simulationFeeAmount > balance) {
      this.snackBar.open(
        `Insufficient fee margin for simulation!\nAmount to send: ${amountToSend}${feeDenom} + Simulation fee: ${simulationFeeAmount}${feeDenom} > Balance: ${balance}${feeDenom}`,
        'Close',
      );
      dialogRefSimulating.close();
      return;
    }

    try {
      simulatedResultData = await this.bank.simulateToSend(
        key,
        toAddress,
        amount,
        minimumGasPrice,
        privateKey,
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

    // check whether the fee exceeded
    const simulatedFee = fee.amount ? parseInt(fee.amount) : 0;
    if (simulatedFee + amountToSend > balance) {
      this.snackBar.open(
        `Insufficient fee margin for send!\nAmount to send: ${amountToSend}${feeDenom} + Simulated fee: ${simulatedFee}${feeDenom} > Balance: ${balance}${feeDenom}`,
        'Close',
      );
      return;
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

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string | undefined;

    try {
      const res = await this.bank.send(key, toAddress, amount, gas, fee, privateKey);
      txhash = res.tx_response?.txhash;
      if (txhash === undefined) {
        throw Error('Invalid txhash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
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
