import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatInputModule,
  MatDatepickerModule,
  MatRadioModule,
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
import { PersonaComponent } from './components/persona/persona.component';

//Services
import { DialogBoxService } from './services/dialog-box.service';
import { AjaxGuardService } from './services/ajax-guard.service';
import { PersonasService } from './services/personas.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule, 
    MatRadioModule,
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
    PersonaComponent,
  ],
  entryComponents:[
    DialogBoxComponent
  ],
  exports:[
    TableComponent,
    FilterComponent,
    DialogBoxComponent,
    PersonaComponent,
  ],
  providers: [
    AjaxGuardService,
    DialogBoxService,
    BaseAjaxService,
  ]
})
export class BaseModule { }
