import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';

const routes: Routes = [
  { path: 'generar', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'generar/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
