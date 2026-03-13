import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const data =[MatTableModule, 
             MatButtonModule, 
             MatIconModule, 
             MatPaginatorModule, 
             MatSortModule, 
             MatInputModule, 
             MatFormFieldModule
  ];

@NgModule({
  declarations: [],
  imports: data,
  exports: data
})
export class MaterialModule { }
