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

import { BaseModule } from 'app/modules/base/base.module';

import { ContactoComponent } from './components/contacto/contacto.component';
import { SearchPersonaComponent } from './components/search-persona/search-persona.component';

import { NameValidatorDirective } from './directives/name-validator.directive';

import { PersonasService } from 'app/modules/base/services/personas.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

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
    BaseModule,
  ],
  declarations: [
    ContactoComponent,
    SearchPersonaComponent,
    NameValidatorDirective
  ],
  providers: [
    PersonasService,
    BaseAjaxService,
  ],
  exports: [
    ContactoComponent,
    SearchPersonaComponent
  ]
})
export class CRMModule { }
