import { KeyBackupDialogService } from '../../../models/keys/key-backup-dialog.service';
import { KeyBackupResult } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { CreateOnSubmitEvent } from '../../../views/keys/create/create.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bip39 from 'bip39';
import { KeyApplicationService } from 'projects/main/src/app/models/keys/key.application.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
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

  onClickCreateMnemonic() {
    this.mnemonic = bip39.generateMnemonic();
    window.alert(
      '\
You must memory this mnemonic and private key.\n\
If you lose both your mnemonic and private key,\n\
you will never be able to restore your account.\n\
In the dialog box that appears after you click the submit button,\n\
make sure to download the backup files of mnemonic and private key,\n\
and store them safely and confidentially without disclosing them to others.\
    ',
    );
    this.keyBackupResult = undefined;
  }

  async onBlurMnemonic(mnemonic: string) {
    if (!mnemonic) {
      return;
    }
    this.privateKey = await this.key.getPrivateKeyFromMnemonic(mnemonic);
    this.keyBackupResult = undefined;
  }

  async onSubmit($event: CreateOnSubmitEvent) {
    const mnemonicWithNoWhitespace = $event.mnemonic.trim();
    this.keyBackupResult = await this.keyBackupDialog.open(
      mnemonicWithNoWhitespace,
      $event.privateKey,
      $event.id,
    );

    if (this.keyBackupResult?.saved === true && this.keyBackupResult?.checked === true) {
      await this.keyApplication.create($event.id, $event.type, $event.privateKey);
    } else {
      this.snackBar.open('Create failed', undefined, {
        duration: 6000,
      });
    }
  }
}
