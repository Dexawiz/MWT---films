import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  snackBar = inject(MatSnackBar);

  errorMessage(msg: string, duration = 3000) {
    this.snackBar.open(msg, "ERROR", {
      duration
    });
  }
  successMessage(msg: string, duration = 3000) {
    this.snackBar.open(msg, "SUCCESS", {
      duration
    });
  }
}
