import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
// OS Modules
import { OpticaModule } from '../optica/optica.module';
import { VentaModule } from '../venta/venta.module';
import { ProductoModule } from '../producto/producto.module';
import { CRMModule } from '../crm/crm.module';
// Rounting
import { SharedOpticaRoutingModule } from './shared-optica-routing.module';
// Components
import { ExamenPresupuestoComponent } from './containers/examen-presupuesto/examen-presupuesto.component';
import { PreciosDetalleComponent } from './containers/precios-detalle/precios-detalle.component';
import { OpticaVentaComponent } from './containers/optica-venta/optica-venta.component';
import { VentaOpticaComponent } from './components/venta-optica/venta-optica.component';

@NgModule({
  imports: [
    CommonModule,
    // Rounting
    SharedOpticaRoutingModule,
    // OS Modules
    OpticaModule,
    ProductoModule,
    VentaModule,
    CRMModule,
    // Angular Material
    MatListModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  declarations: [
    PreciosDetalleComponent,
    OpticaVentaComponent,
    ExamenPresupuestoComponent,
    VentaOpticaComponent
  ]
})
export class SharedOpticaModule { }
