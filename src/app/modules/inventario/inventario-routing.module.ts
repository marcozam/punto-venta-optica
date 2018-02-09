import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { CorteInventarioComponent } from './components/corte-inventario/corte-inventario.component';

const routes: Routes = [
  { path: 'movimientos', component: MovimientosComponent, data: { title: 'Movimientos de Inventario' } },
  { path: 'corte', component: CorteInventarioComponent, data: { title: 'Corte de Inventario' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
