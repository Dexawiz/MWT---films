import { Component, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

export class ConfirmDialogData {
  constructor(
    public title: string,
    public message: string
  ){}
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
