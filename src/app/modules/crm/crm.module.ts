import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  MatInputModule, 
  MatButtonModule, 
  MatIconModule, 
  MatProgressBarModule, 
  MatSelectModule,
  MatTooltipModule,
  MatListModule,
} from '@angular/material';

import { CrmRoutingModule } from './crm-routing.module';

import { GenericCatalogsModule } from 'app/modules/generic-catalogs/generic-catalogs.module';

import { ContactoComponent } from './components/contacto/contacto.component';
import { SearchPersonaComponent } from './components/search-persona/search-persona.component';
import { NameValidatorDirective } from './directives/name-validator.directive';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    //Material
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatSelectModule,
    MatTooltipModule,
    MatListModule,
    FormsModule,
    GenericCatalogsModule,
  ],
  declarations: [
    ContactoComponent,
    SearchPersonaComponent,
    NameValidatorDirective
  ],
  exports: [
    ContactoComponent,
    SearchPersonaComponent
  ]
})
export class CRMModule { }
