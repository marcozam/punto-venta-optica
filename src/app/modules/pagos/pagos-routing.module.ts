import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { EntregasAbonosComponent } from './components/entregas-abonos/entregas-abonos.component'
import { CorteListComponent } from './components/corte-list/corte-list.component';

const routes: Routes = [
  { path: 'caja/movimientos', component: MovimientosSinCorteComponent, data: { title: 'Movimientos sin corte de caja' } },
  { path: 'caja/cortes', component: CorteListComponent, data: { title: 'Cortes de Caja' } },
  { path: 'venta/entregas', component: EntregasAbonosComponent, data: { title: 'Ordenes de venta pendiente de entrega' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
