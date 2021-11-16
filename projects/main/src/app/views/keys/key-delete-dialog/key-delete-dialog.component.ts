import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-key-delete-dialog',
  templateUrl: './key-delete-dialog.component.html',
  styleUrls: ['./key-delete-dialog.component.css']
})
export class KeyDeleteDialogComponent implements OnInit {

  inputId = ""

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      id: string;
    },
    public matDialogRef: MatDialogRef<KeyDeleteDialogComponent>,
    private readonly snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  checkDeleteAccount(id: string) {
    if (id === this.data.id) {
      this.snackBar.open('Collect ID', undefined, {
        duration: 2000,
      });
    } else {
      this.snackBar.open('Wrong ID', undefined, {
        duration: 2000,
      });
    }
  }

}
