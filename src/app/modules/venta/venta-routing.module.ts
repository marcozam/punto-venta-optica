import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './containers/ventas/ventas.component';
import { ResumenVentaMesComponent } from './components/resumen-venta-mes/resumen-venta-mes.component';

const routes: Routes = [
  { path: 'generar', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'generar/:clienteID', component: VentasComponent, data: { title: 'Generar Venta' } },
  { path: 'resumen', component: ResumenVentaMesComponent, data: { title: 'Resumen de Ventas por Mes' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }
