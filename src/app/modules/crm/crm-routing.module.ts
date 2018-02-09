import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './containers/home/home.component';
import { ContactoComponent} from './components/contacto/contacto.component';

const routes: Routes = [
  { path: 'search', component: HomeComponent, data: { title: 'Inicio' } },
  { path: 'contacto/:type/:ID', component: ContactoComponent, data: { title: 'Datos Paciente' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
