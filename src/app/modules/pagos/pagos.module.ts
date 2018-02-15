import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
// Routing
import { PagosRoutingModule } from './pagos-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { ExamenService } from 'app/modules/optica/services/examen.service';
import { AngularFireDatabase } from 'angularfire2/database';
// Components
import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { ListaVentasComponent } from './components/lista-ventas/lista-ventas.component';
import { RegistrarCorteComponent } from './components/registrar-corte/registrar-corte.component';
import { CorteListComponent } from './components/corte-list/corte-list.component';
import { MovimientosCajaComponent } from './components/movimientos-caja/movimientos-caja.component';
import { VentasPendientesEntregaComponent } from './containers/ventas-pendientes-entrega/ventas-pendientes-entrega.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PagosRoutingModule,
    // Material2 Modules
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatTooltipModule,
    MatProgressBarModule,
    // OS Modules
    BaseModule,
  ],
  declarations: [
    MovimientosSinCorteComponent,
    ListaVentasComponent,
    RegistrarCorteComponent,
    CorteListComponent,
    MovimientosCajaComponent,
    VentasPendientesEntregaComponent,
  ],
  entryComponents: [
    RegistrarCorteComponent
  ],
  // Used by Ticket Printing
  providers: [
    VentaService,
    ContactoService,
    ExamenService,
    DecimalPipe,
    DatePipe,
  ]
})
export class PagosModule { }
