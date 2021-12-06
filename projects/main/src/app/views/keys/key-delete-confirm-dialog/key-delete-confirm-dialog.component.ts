import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeyApplicationService } from 'projects/main/src/app/models/keys/key.application.service';

@Component({
  selector: 'app-key-delete-confirm-dialog',
  templateUrl: './key-delete-confirm-dialog.component.html',
  styleUrls: ['./key-delete-confirm-dialog.component.css'],
})
export class KeyDeleteConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      id: string;
    },
    public matDialogRef: MatDialogRef<KeyDeleteConfirmDialogComponent>,
    private readonly keyApplication: KeyApplicationService,
  ) {}

  ngOnInit(): void {}

  confirm(): void {
    this.keyApplication.delete(this.data.id);
    this.matDialogRef.close();
  }

  notConfirm(): void {
    this.matDialogRef.close();
  }
}
