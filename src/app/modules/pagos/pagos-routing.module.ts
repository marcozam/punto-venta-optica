import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { VentasPendientesEntregaComponent } from './containers/ventas-pendientes-entrega/ventas-pendientes-entrega.component'
import { CorteListComponent } from './components/corte-list/corte-list.component';

const routes: Routes = [
  { path: 'caja/movimientos', component: MovimientosSinCorteComponent, data: { title: 'Movimientos sin corte de caja' } },
  { path: 'caja/cortes', component: CorteListComponent, data: { title: 'Cortes de Caja' } },
  { path: 'venta/entregas', component: VentasPendientesEntregaComponent, data: { title: 'Ordenes de venta pendiente de entrega' }},
  { path: 'venta/entregas/:clienteID', component: VentasPendientesEntregaComponent, data: { title: 'Ordenes de venta pendientes' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
