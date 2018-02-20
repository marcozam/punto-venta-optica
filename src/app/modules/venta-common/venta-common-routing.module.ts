import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenVentaMesComponent } from './containers/resumen-venta-mes/resumen-venta-mes.component';

const routes: Routes = [
    { path: 'resumen', component: ResumenVentaMesComponent, data: { title: 'Resumen de Ventas por Mes' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaCommonRoutingModule { }
