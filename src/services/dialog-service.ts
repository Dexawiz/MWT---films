import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  confirm(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: new ConfirmDialogData(title, message)
    });
    return dialogRef.afterClosed();
  }
}
