import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';
import { MovimientosSinCorteComponent } from './containers/movimientos-sin-corte/movimientos-sin-corte.component';
import { EntregasAbonosComponent } from './components/entregas-abonos/entregas-abonos.component'
import { CorteListComponent } from 'app/modules/venta/components/corte-list/corte-list.component';

const routes: Routes = [
  { path: 'ventas', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'ventas/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'caja/movimientos', component: MovimientosSinCorteComponent, data: { title: 'Movimientos sin corte de caja' } },
  { path: 'caja/cortes', component: CorteListComponent, data: { title: 'Cortes de Caja' } },
  { path: 'venta/entregas', component: EntregasAbonosComponent, data: { title: 'Ordenes de venta pendiente de entrega' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
