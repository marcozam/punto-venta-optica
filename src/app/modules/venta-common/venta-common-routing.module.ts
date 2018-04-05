import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenVentaMesComponent } from './containers/resumen-venta-mes/resumen-venta-mes.component';
import { ResumenVentaProductosComponent } from './containers/resumen-venta-productos/resumen-venta-productos.component';

const routes: Routes = [
    { path: 'resumen', component: ResumenVentaMesComponent, data: { title: 'Resumen de Ventas por Mes' } },
    { path: 'resumen/productos', component: ResumenVentaProductosComponent, data: { title: 'Resumen de Ventas por Producto' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaCommonRoutingModule { }
