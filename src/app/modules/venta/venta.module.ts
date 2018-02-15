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
// Routing
import { VentaRoutingModule } from './venta-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
// Components
import { VentasComponent } from './containers/ventas/ventas.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { AddProductoComponent } from './components/add-producto/add-producto.component';
import { MetodoPagoVentaComponent } from './components/metodo-pago-venta/metodo-pago-venta.component';
import { AddDescuentoProductoComponent } from './components/add-descuento-producto/add-descuento-producto.component';
import { ResumenVentaMesComponent } from './components/resumen-venta-mes/resumen-venta-mes.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    // Routing
    VentaRoutingModule,
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
    VentasComponent,
    DetalleVentaComponent,
    AddProductoComponent,
    MetodoPagoVentaComponent,
    AddDescuentoProductoComponent,
    ResumenVentaMesComponent,
  ],
  exports: [
    VentasComponent,
    VentaRoutingModule
  ],
  entryComponents: [
    MetodoPagoVentaComponent,
    AddDescuentoProductoComponent
  ],
  providers: [ VentaService ]
})
export class VentaModule { }
