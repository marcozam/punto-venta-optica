import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PreciosDetalleComponent } from './containers/precios-detalle/precios-detalle.component';
import { ExamenPresupuestoComponent } from './containers/examen-presupuesto/examen-presupuesto.component';

const routes: Routes = [
  { path: 'presupuesto/:pacienteID', component: ExamenPresupuestoComponent, data: { title: 'Presupuesto' } },
  { path: 'lista-precios', component: PreciosDetalleComponent, data: {title: 'Lista de Precios'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedOpticaRoutingModule { }
