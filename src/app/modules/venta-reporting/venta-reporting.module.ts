import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
// Routing
import { VentaReportingRoutingModule } from './venta-reporting-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { ExamenService } from 'app/modules/optica/services/examen.service';
// Components
import { ListaVentasComponent } from './components/lista-ventas/lista-ventas.component';
import { ResumenVentaMesComponent } from './containers/resumen-venta-mes/resumen-venta-mes.component';

@NgModule({
  imports: [
    CommonModule,
    BaseModule,
    VentaReportingRoutingModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    ResumenVentaMesComponent,
    ListaVentasComponent
  ],
  exports: [
    ListaVentasComponent
  ],
  providers: [
    VentaService,
    ContactoService,
    ExamenService,
    DecimalPipe,
    DatePipe
  ]
})
export class VentaReportingModule { }
