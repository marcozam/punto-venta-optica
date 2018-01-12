import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';

const routes: Routes = [
  { path: 'ventas', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'ventas/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
