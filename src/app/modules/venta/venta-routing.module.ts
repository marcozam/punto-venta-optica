import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';
import { ResumenVentaMesComponent } from './components/resumen-venta-mes/resumen-venta-mes.component';

const routes: Routes = [
  { path: 'ventas', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'ventas/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'resumen/ventas', component: ResumenVentaMesComponent, data: { title: 'Resumen de Ventas por Mes' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
