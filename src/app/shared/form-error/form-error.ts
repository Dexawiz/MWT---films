import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [MatFormFieldModule],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
})
export class FormErrorComponent {
  @Input() error?: string;
}
