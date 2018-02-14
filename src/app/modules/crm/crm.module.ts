import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
import { MatInputModule, MatProgressBarModule, MatSelectModule,
        MatTooltipModule, MatButton, MatButtonModule,
        MatIconModule, MatListModule} from '@angular/material';
// Routing
import { CrmRoutingModule } from './crm-routing.module';
// OSModules
import { BaseModule } from 'app/modules/base/base.module';
// Components
import { ContactoComponent } from './components/contacto/contacto.component';
import { SearchPersonaComponent } from './components/search-persona/search-persona.component';
import { DialogActionsComponent } from './components/dialog-actions/dialog-actions.component';
import { HomeComponent } from './containers/home/home.component';
// Directives
import { NameValidatorDirective } from './directives/name-validator.directive';
// Services
import { ContactoService } from './services/contacto.service';
import { PersonasService } from 'app/modules/base/services/personas.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // Routing
    CrmRoutingModule,
    // OS Module
    BaseModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    ContactoComponent,
    SearchPersonaComponent,
    DialogActionsComponent,
    HomeComponent,
    NameValidatorDirective
  ],
  providers: [
    ContactoService,
    PersonasService,
  ],
  exports: [
    ContactoComponent,
    SearchPersonaComponent
  ],
  entryComponents: [
    DialogActionsComponent
  ]
})
export class CRMModule { }
