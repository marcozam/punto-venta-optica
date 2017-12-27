import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactoComponent} from './components/contacto/contacto.component';

const routes: Routes = [
  { path: 'contacto/:type/:ID', component: ContactoComponent, data: { title: 'Datos Paciente' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
