import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
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
// FireBase
import { environment } from 'environments/environment';
import { AngularFireModule, } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
// Routing
import { GenericCatalogsRoutingModule } from './generic-catalogs-routing.module';
// Components
import { GenericCatalogComponent } from './components/generic-catalog/generic-catalog.component';
import { GenericCatalogListComponent } from './components/generic-catalog-list/generic-catalog-list.component';
import { DynamicCatalogListComponent } from './components/dynamic-catalog-list/dynamic-catalog-list.component';
import { DynamicCatalogComponent } from './components/dynamic-catalog/dynamic-catalog.component';
import { DynamicCatalogFieldsComponent } from './components/dynamic-catalog-fields/dynamic-catalog-fields.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  declarations: [
    GenericCatalogComponent,
    GenericCatalogListComponent,
    DynamicCatalogListComponent,
    DynamicCatalogComponent,
    DynamicCatalogFieldsComponent,
  ],
  providers: [
    AngularFireDatabase
  ]
})
export class GenericCatalogsModule { }
