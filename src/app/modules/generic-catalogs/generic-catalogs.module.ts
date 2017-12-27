import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  MatDatepickerModule, 
  MatNativeDateModule, 
  MatInputModule, 
  MatRadioModule, 
  MatDialogModule, 
  MatButtonModule, 
  MatIconModule, 
  MatListModule, 
  MatProgressBarModule, 
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatAutocompleteModule
} from '@angular/material';

//OS Modules
import { BaseModule } from 'app/modules/base/base.module';

import { GenericCatalogsRoutingModule } from './generic-catalogs-routing.module';

//Components
import { PersonaComponent } from './components/persona/persona.component';
import { GenericCatalogComponent } from './components/generic-catalog/generic-catalog.component';
import { GenericCatalogListComponent } from './components/generic-catalog-list/generic-catalog-list.component';
import { DynamicCatalogListComponent } from './components/dynamic-catalog-list/dynamic-catalog-list.component';
import { DynamicCatalogComponent } from './components/dynamic-catalog/dynamic-catalog.component';
import { DynamicCatalogFieldsComponent } from './components/dynamic-catalog-fields/dynamic-catalog-fields.component';

//Services
import { BaseAjaxService } from '../base/services/base-ajax.service';
import { PersonasService } from 'app/modules/generic-catalogs/services/personas.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatInputModule, 
    MatRadioModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    GenericCatalogsRoutingModule,
    BaseModule,
  ],
  declarations: [
    PersonaComponent,
    GenericCatalogComponent,
    GenericCatalogListComponent,
    DynamicCatalogListComponent,
    DynamicCatalogComponent,
    DynamicCatalogFieldsComponent,
  ],
  exports: [
    PersonaComponent,
  ],
  providers: [
    BaseAjaxService,
    PersonasService
  ]
})
export class GenericCatalogsModule { }