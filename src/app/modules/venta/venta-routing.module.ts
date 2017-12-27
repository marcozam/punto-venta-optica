import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';
import { MovimientosCajaComponent } from './containers/movimientos-caja/movimientos-caja.component';
import { EntregasAbonosComponent } from './components/entregas-abonos/entregas-abonos.component'

const routes: Routes = [
  { path: 'ventas', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'ventas/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'caja/movimientos', component: MovimientosCajaComponent, data: { title: 'Movimientos sin corte de caja' } },
  { path: 'venta/entregas', component: EntregasAbonosComponent, data: { title: 'Ordenes de venta pendiente de entrega' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
