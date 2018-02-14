import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamenComponent } from './containers/examen/examen.component';

import { TipoMicaComponent } from './components/tipo-mica/tipo-mica.component';
import { MarcaArmazonComponent } from './components/marca-armazon/marca-armazon.component';
import { ModeloArmazonComponent } from './components/modelo-armazon/modelo-armazon.component';
import { ModeloAramazonListComponent } from './components/modelo-aramazon-list/modelo-aramazon-list.component';

const routes: Routes = [
  { path: 'examen/:pacienteID', component: ExamenComponent, data: { title: 'Examen de la Vista' } },
  // Catalogos
  { path: 'armazon/marca/:detailID', component: MarcaArmazonComponent , data: { title: 'Marca de Armazon' }},
  { path: 'armazon/modelo', component: ModeloAramazonListComponent , data: { title: 'Modelo de Armazon' }},
  { path: 'armazon/modelo/:detailID', component: ModeloArmazonComponent , data: { title: 'Modelo de Armazon' }},
  { path: 'mica/tipo/:detailID', component: TipoMicaComponent , data: { title: 'Tipo de Mica' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpticaRoutingModule { }
