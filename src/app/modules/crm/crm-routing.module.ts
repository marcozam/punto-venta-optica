import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactoComponent} from './components/contacto/contacto.component';
import { VentasPendientesEntregaComponent } from 'app/modules/pagos/containers/ventas-pendientes-entrega/ventas-pendientes-entrega.component';

const routes: Routes = [
  { path: 'contacto/:type/:ID', component: ContactoComponent, data: { title: 'Datos Paciente' } },
  { path: 'crm/historial/:clienteID', component: VentasPendientesEntregaComponent, data: { title: 'Historial de Compras'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
