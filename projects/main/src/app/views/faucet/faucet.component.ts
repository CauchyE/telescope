import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaucetRequest } from 'projects/main/src/app/models/faucets/faucet.model';

export type Amount = {
  amount: number;
  denom: string;
};

@Component({
  selector: 'app-view-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  @Input() denoms?: string[];
  @Input() address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: number | null;
  @Input() creditAmount?: number | null;
  @Input() maxCredit?: number | null;

  @Output() postFaucetRequested: EventEmitter<FaucetRequest> = new EventEmitter<FaucetRequest>();
  @Output() selectedDenomChanged: EventEmitter<string> = new EventEmitter();

  focusAmount: boolean;

  constructor(private matSnackBar: MatSnackBar) {
    this.focusAmount = false;
  }

  ngOnInit(): void {}

  onPostFaucetRequested(address: string, amount: string): void {
    if (!this.denom) {
      this.matSnackBar.open('Invalid Denom! Valid Denom must be selected!', undefined, {
        duration: 6000,
      });
      return;
    }
    const faucetRequest: FaucetRequest = {
      address,
      coins: [
        {
          amount: parseInt(amount),
          denom: this.denom,
        },
      ],
    };
    if (faucetRequest.coins.length > 0) {
      this.postFaucetRequested.emit(faucetRequest);
    } else {
      this.matSnackBar.open('No Claims! At least 1 amount must be plus number!', undefined, {
        duration: 6000,
      });
    }
  }

  onSelectedDenomChanged(selectedDenom: string): void {
    this.selectedDenomChanged.emit(selectedDenom);
  }
}
