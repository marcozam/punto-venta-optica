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
  ],
  exports:[
    VentasComponent,
    VentaRoutingModule
  ],
  entryComponents: [
    MetodoPagoVentaComponent,
    AddDescuentoProductoComponent
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