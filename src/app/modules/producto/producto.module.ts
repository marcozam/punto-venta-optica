import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
import {
  MatButtonModule, MatSelectModule, MatIconModule, MatInputModule, MatFormFieldModule,
  MatTooltipModule, MatCardModule, MatCheckboxModule
 } from '@angular/material';

// Routing
import { ProductoRoutingModule } from './producto-routing.module';
// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
// Components
import { ProductosComponent } from './containers/productos/productos.component';
import { ProductosListComponent } from './containers/productos-list/productos-list.component';
import { CategoriaProductoComponent } from './components/categoria-producto/categoria-producto.component';
import { DetallePreciosProductoComponent } from './components/detalle-precios-producto/detalle-precios-producto.component';
// Services
import { BaseAjaxService } from './../base/services/base-ajax.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // Routing
    ProductoRoutingModule,
    // OS Module
    BaseModule,
    // Material
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCardModule,
    MatCheckboxModule
  ],
  declarations: [
    // OS Components
    ProductosComponent,
    ProductosListComponent,
    CategoriaProductoComponent,
    DetallePreciosProductoComponent,
  ],
  exports: [
    ProductoRoutingModule,
    ProductosComponent,
    ProductosListComponent,
    DetallePreciosProductoComponent,
  ],
  providers: [
    BaseAjaxService
  ]
})
export class ProductoModule { }
