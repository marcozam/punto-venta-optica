import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule, 
  MatSelectModule, 
  MatIconModule, 
  MatInputModule, 
  MatFormFieldModule
} from '@angular/material';

//OS Modules
import { BaseModule } from 'app/modules/base/base.module';

import { InventarioRoutingModule } from './inventario-routing.module'
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { CorteInventarioComponent } from './components/corte-inventario/corte-inventario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InventarioRoutingModule,
    //Material
    MatButtonModule, 
    MatSelectModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    //OS Modules
    BaseModule
  ],
  declarations: [
    MovimientosComponent, 
    CorteInventarioComponent
  ]
})
export class InventarioModule { }
