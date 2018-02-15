import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
// Common
import { MonthYearSelectorComponent } from './components/month-year-selector/month-year-selector.component';
import { DateSelectionComponent } from './components/date-selection/date-selection.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
// Table
import { TableComponent } from './components/table/table.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FilterComponent } from './components/filter/filter.component';
// Basic Catalogs
import { PersonaComponent } from './components/persona/persona.component';

// Services
import { PersonasService } from './services/personas.service';
import { DialogBoxService } from './services/dialog-box.service';
import { AjaxGuardService } from './services/ajax-guard.service';
import { BaseAjaxService } from './services/base-ajax.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material
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
  entryComponents: [
    DialogBoxComponent
  ],
  exports: [
    TableComponent,
    FilterComponent,
    DialogBoxComponent,
    PersonaComponent,
    MonthYearSelectorComponent,
    DateSelectionComponent,
  ],
  providers: [
    PersonasService,
    // Global Services
    AjaxGuardService,
    BaseAjaxService,
    DialogBoxService,
  ]
})
export class BaseModule { }
