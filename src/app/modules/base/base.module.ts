import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatDialogModule, 
  MatButtonModule, 
  MatIconModule, 
  MatSelectModule,
  MatTooltipModule,
  MatProgressBarModule,
} from '@angular/material';

//Components
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { TableComponent } from './components/table/table.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FilterComponent } from './components/filter/filter.component';

//Services
import { DialogBoxService } from './services/dialog-box.service';
import { AjaxGuardService } from './services/ajax-guard.service';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  declarations: [
    TableComponent,
    DialogBoxComponent,
    PaginatorComponent,
    FilterComponent,
  ],
  entryComponents:[
    DialogBoxComponent
  ],
  exports:[
    TableComponent,
    FilterComponent,
    DialogBoxComponent
  ],
  providers: [
    AjaxGuardService,
    DialogBoxService
  ]
})
export class BaseModule { }
