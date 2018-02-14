import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular Material
import { MatListModule, MatProgressBarModule, MatIconModule, MatTabsModule, } from '@angular/material';
// OS Modules
import { OpticaModule } from '../optica/optica.module';
import { VentaModule } from '../venta/venta.module';
import { ProductoModule } from '../producto/producto.module';
// Rounting
import { SharedOpticaRoutingModule } from './shared-optica-routing.module';
// Components
import { ExamenPresupuestoComponent } from './containers/examen-presupuesto/examen-presupuesto.component';
import { PreciosDetalleComponent } from './containers/precios-detalle/precios-detalle.component';
import { OpticaVentaComponent } from './containers/optica-venta/optica-venta.component';

@NgModule({
  imports: [
    CommonModule,
    // Rounting
    SharedOpticaRoutingModule,
    // OS Modules
    OpticaModule,
    ProductoModule,
    VentaModule,
    // Angular Material
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
  ],
  declarations: [
    PreciosDetalleComponent,
    OpticaVentaComponent,
    ExamenPresupuestoComponent
  ]
})
export class SharedOpticaModule { }
