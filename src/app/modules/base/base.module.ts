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
import { MonthYearSelectorComponent } from './components/month-year-selector/month-year-selector.component';
import { DateSelectionComponent } from './components/date-selection/date-selection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    //Material
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
    MonthYearSelectorComponent,
    DateSelectionComponent,
  ],
  entryComponents:[
    DialogBoxComponent
  ],
  exports:[
    TableComponent,
    FilterComponent,
    DialogBoxComponent,
    PersonaComponent,
    MonthYearSelectorComponent,
    DateSelectionComponent,
  ],
  providers: [
    AjaxGuardService,
    DialogBoxService,
    BaseAjaxService,
  ]
})
export class BaseModule { }
