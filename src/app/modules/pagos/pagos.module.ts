import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Routing
import { PagosRoutingModule } from './pagos-routing.module';

import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { EntregasAbonosComponent } from './components/entregas-abonos/entregas-abonos.component';
import { RegistrarCorteComponent } from './components/registrar-corte/registrar-corte.component';
import { CorteListComponent } from './components/corte-list/corte-list.component';
import { MovimientosCajaComponent } from './components/movimientos-caja/movimientos-caja.component';

import {
  MatButtonModule, 
  MatSelectModule, 
  MatIconModule, 
  MatInputModule, 
  MatFormFieldModule, 
  MatListModule,
  MatGridListModule,
  MatTooltipModule,
  MatProgressBarModule,
} from '@angular/material';

//OS Modules
import { BaseModule } from 'app/modules/base/base.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PagosRoutingModule,
    //Material2 Modules
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatListModule,
    MatGridListModule,
    MatTooltipModule,
    MatProgressBarModule,
    //OS Modules
    BaseModule,
  ],
  declarations: [
    MovimientosSinCorteComponent,
    EntregasAbonosComponent,
    RegistrarCorteComponent,
    CorteListComponent,
    MovimientosCajaComponent
  ],
  entryComponents: [
    RegistrarCorteComponent
  ]
})
export class PagosModule { }