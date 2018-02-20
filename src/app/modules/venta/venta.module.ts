import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
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
import { PagosModule } from '../pagos/pagos.module';
// Routing
import { VentaRoutingModule } from './venta-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
// Components
import { VentasComponent } from './containers/ventas/ventas.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { AddProductoComponent } from './components/add-producto/add-producto.component';
import { AddDescuentoProductoComponent } from './components/add-descuento-producto/add-descuento-producto.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    // Routing
    VentaRoutingModule,
    // Material
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
    PagosModule
  ],
  declarations: [
    VentasComponent,
    DetalleVentaComponent,
    AddProductoComponent,
    AddDescuentoProductoComponent,
  ],
  exports: [
    VentasComponent,
    VentaRoutingModule
  ],
  entryComponents: [
    AddDescuentoProductoComponent
  ],
  providers: [ VentaService ]
})
export class VentaModule { }
