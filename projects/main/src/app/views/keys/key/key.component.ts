import { KeyDeleteDialogService } from '../../../models/keys/key-delete-dialog.service';
import { Key } from '../../../models/keys/key.model';
import { Component, OnInit, Input } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';

@Component({
  selector: 'view-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  @Input()
  key?: Key | null;

  @Input()
  accAddress?: cosmosclient.AccAddress | null;

  @Input()
  valAddress?: cosmosclient.ValAddress | null;

  @Input()
  faucets?:
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | null;

  constructor(private readonly keyDeleteDialogService: KeyDeleteDialogService) {}

  ngOnInit(): void {}

  openDeleteDialog(id: string) {
    this.keyDeleteDialogService.openKeyDeleteDialog(id);
  }
}
