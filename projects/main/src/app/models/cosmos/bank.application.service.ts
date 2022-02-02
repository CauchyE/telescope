import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { Key } from '../keys/key.model';
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
  ) {}

  async send(
    key: Key,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    privateKey: string,
    coins: proto.cosmos.base.v1beta1.ICoin[],
  ) {
    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    //Todo: if amount has maximum gasDenom, do amount -1
    const maximumGasPrice = coins.find((coin) => coin.denom === minimumGasPrice.denom);
    const amountGasPrice = amount.find((amount) => amount.denom === minimumGasPrice.denom);

    const fixedAmount: proto.cosmos.base.v1beta1.ICoin[] = [];
    amount.forEach((amount) => {
      //has gas denom
      if (
        maximumGasPrice?.amount === amountGasPrice?.amount &&
        amount.denom === minimumGasPrice.denom
      ) {
        const amountForSimulation = parseInt(amount.amount || '0') - 1;
        fixedAmount.push({ amount: amountForSimulation.toString(), denom: amount.denom });
      } else {
        fixedAmount.push(amount);
      }
    });

    try {
      simulatedResultData = await this.bank.simulateToSend(
        key,
        toAddress,
        fixedAmount,
        minimumGasPrice,
        privateKey,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`);
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // check whether the fee exceeded
    const isOver =
      parseInt(fee.amount || '0') + parseInt(amountGasPrice?.amount || '0') >
      parseInt(maximumGasPrice?.amount || '0');

    // ask the user to confirm the fee with a dialog
    const txFeeConfirmedResult = await this.dialog
      .open(TxFeeConfirmDialogComponent, {
        data: {
          fee,
          isTxFeeOver: isOver,
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
      this.snackBar.open(`An error has occur: ${msg}`, undefined, {
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
