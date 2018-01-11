import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
import { OpticaModule } from '../optica/optica.module';
import { BaseModule } from 'app/modules/base/base.module';
//Routing
import { VentaRoutingModule } from './venta-routing.module';
//Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
//Components
import { VentasComponent } from './containers/ventas/ventas.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { AddProductoComponent } from './components/add-producto/add-producto.component';
import { MetodoPagoVentaComponent } from './components/metodo-pago-venta/metodo-pago-venta.component';
import { AddDescuentoProductoComponent } from './components/add-descuento-producto/add-descuento-producto.component';
import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { EntregasAbonosComponent } from './components/entregas-abonos/entregas-abonos.component';
import { RegistrarCorteComponent } from './components/registrar-corte/registrar-corte.component';
import { CorteListComponent } from './components/corte-list/corte-list.component';
import { MovimientosCajaComponent } from './components/movimientos-caja/movimientos-caja.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //Routing
    VentaRoutingModule,
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
    OpticaModule,
    BaseModule,
  ],
  declarations: [
    VentasComponent,
    DetalleVentaComponent,
    AddProductoComponent,
    MetodoPagoVentaComponent,
    AddDescuentoProductoComponent,
    MovimientosSinCorteComponent,
    EntregasAbonosComponent,
    RegistrarCorteComponent,
    CorteListComponent,
    MovimientosCajaComponent
  ],
  exports:[
    VentasComponent,
    VentaRoutingModule
  ],
  entryComponents: [
    MetodoPagoVentaComponent,
    AddDescuentoProductoComponent,
    RegistrarCorteComponent
  ],
  providers: [
    VentaService,
    //TBD
    ContactoService,
    DecimalPipe, 
    DatePipe
  ]
})
export class VentaModule { }