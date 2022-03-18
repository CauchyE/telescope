import { KeyBackupDialogService } from '../../../models/keys/key-backup-dialog.service';
import { KeyBackupResult } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { ImportOnSubmitEvent } from '../../../views/keys/import/import.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bip39 from 'bip39';
import { KeyApplicationService } from 'projects/main/src/app/models/keys/key.application.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent implements OnInit {
  mnemonic: string;
  privateKey: string;
  keyBackupResult?: KeyBackupResult;

  constructor(
    private readonly keyApplication: KeyApplicationService,
    private readonly key: KeyService,
    private readonly keyBackupDialog: KeyBackupDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.mnemonic = '';
    this.privateKey = '';
  }

  ngOnInit(): void {}

  async onBlurMnemonic(mnemonic: string) {
    if (!mnemonic) {
      return;
    }
    this.privateKey = await this.key.getPrivateKeyFromMnemonic(mnemonic);
    this.keyBackupResult = undefined;
  }

  async onSubmit($event: ImportOnSubmitEvent) {
    const mnemonicWithNoWhitespace = $event.mnemonic.trim();
    this.keyBackupResult = await this.keyBackupDialog.open(
      mnemonicWithNoWhitespace,
      $event.privateKey,
      $event.id,
    );

    if (this.keyBackupResult?.saved === true && this.keyBackupResult?.checked === true) {
      await this.keyApplication.import($event.id, $event.type, $event.privateKey);
    } else {
      this.snackBar.open('Import failed', undefined, {
        duration: 6000,
      });
    }
  }
}
