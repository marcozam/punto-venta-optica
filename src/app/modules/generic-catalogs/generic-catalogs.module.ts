import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Material
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    // Material
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
    // Routing
    GenericCatalogsRoutingModule,
    // OS Modules
    BaseModule,
  ],
  declarations: [
    GenericCatalogComponent,
    GenericCatalogListComponent,
    DynamicCatalogListComponent,
    DynamicCatalogComponent,
    DynamicCatalogFieldsComponent,
  ],
})
export class GenericCatalogsModule { }
