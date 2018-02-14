import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericCatalogComponent } from './components/generic-catalog/generic-catalog.component';
import { GenericCatalogListComponent } from './components/generic-catalog-list/generic-catalog-list.component';
import { DynamicCatalogComponent } from './components/dynamic-catalog/dynamic-catalog.component'
import { DynamicCatalogListComponent } from './components/dynamic-catalog-list/dynamic-catalog-list.component';

const routes: Routes = [
  { path: 'catalogo/:catalogID', component: GenericCatalogListComponent, data: { title: 'Lista' } },
  { path: 'catalogo/:catalogID/:detailID', component: GenericCatalogComponent, data: { title: 'Catalogo' } },
  { path: '', component: DynamicCatalogListComponent, data: { title: 'Generador de Catalogos Dinamico' }},
  { path: ':catalogID', component: DynamicCatalogComponent, data: { title: 'Generador de Catalogos Dinamico' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericCatalogsRoutingModule { }
