import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// OS Modules
import { BaseModule } from 'app/modules/base/base.module';

import { InventarioRoutingModule } from './inventario-routing.module';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { CorteInventarioComponent } from './components/corte-inventario/corte-inventario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InventarioRoutingModule,
    // Material
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    // OS Modules
    BaseModule
  ],
  declarations: [
    MovimientosComponent,
    CorteInventarioComponent
  ]
})
export class InventarioModule { }
