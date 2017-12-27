import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaProductoComponent } from './components/categoria-producto/categoria-producto.component';
import { ProductosComponent } from './containers/productos/productos.component';
import { ProductosListComponent } from './containers/productos-list/productos-list.component';

const routes: Routes = [
  { path: 'productos/categorias/:id', component: CategoriaProductoComponent, data: { title: 'Categoria de Productos' } },
  { path: 'productos', component: ProductosListComponent, data: { title: 'Productos' } },
  { path: 'productos/detail/:id', component: ProductosComponent, data: { title: 'Producto' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
