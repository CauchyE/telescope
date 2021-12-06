import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { proto } from '@cosmos-client/core';

@Component({
  selector: 'app-view-tx-fee-confirm-dialog',
  templateUrl: './tx-fee-confirm-dialog.component.html',
  styleUrls: ['./tx-fee-confirm-dialog.component.css'],
})
export class TxFeeConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      fee: proto.cosmos.base.v1beta1.ICoin;
      isConfirmed: boolean;
    },
    private readonly dialogRef: MatDialogRef<TxFeeConfirmDialogComponent>,
  ) {}

  ngOnInit(): void {}

  okToSendTx(): void {
    this.data.isConfirmed = true;
    this.dialogRef.close(this.data);
  }

  cancelToSendTx(): void {
    this.data.isConfirmed = false;
    this.dialogRef.close(this.data);
  }
}
