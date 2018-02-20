import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
import { VentaCommonModule } from 'app/modules/venta-common/venta-common.module';
// Routing
import { PagosRoutingModule } from './pagos-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { ExamenService } from 'app/modules/optica/services/examen.service';
// Components
import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { RegistrarCorteComponent } from './components/registrar-corte/registrar-corte.component';
import { CorteListComponent } from './components/corte-list/corte-list.component';
import { MovimientosCajaComponent } from './components/movimientos-caja/movimientos-caja.component';
import { VentasPendientesEntregaComponent } from './containers/ventas-pendientes-entrega/ventas-pendientes-entrega.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PagosRoutingModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    // OS Modules
    BaseModule,
    VentaCommonModule,
  ],
  declarations: [
    MovimientosSinCorteComponent,
    RegistrarCorteComponent,
    CorteListComponent,
    MovimientosCajaComponent,
    VentasPendientesEntregaComponent,
  ],
  entryComponents: [
    RegistrarCorteComponent,
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
