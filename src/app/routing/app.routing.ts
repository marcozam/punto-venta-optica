import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards';

const appRoutes: Routes = [
    // Core
    {
      path: 'auth',
      loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule) },
    {
      path: 'productos',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/producto/producto.module').then(m => m.ProductoModule) },
    {
      path: 'inventario',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/inventario/inventario.module').then(m => m.InventarioModule) },
    {
      path: 'ventas',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/venta/venta.module').then(m => m.VentaModule) },
    {
      path: 'crm',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/crm/crm.module').then(m => m.CRMModule) },
    {
      path: 'caja',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/pagos/pagos.module').then(m => m.PagosModule) },
    // Reporting
    {
      path: 'reporting/ventas',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/venta-common/venta-common.module').then(m => m.VentaCommonModule) },
    // Base
    {
      path: 'DCG',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/generic-catalogs/generic-catalogs.module').then(m => m.GenericCatalogsModule) },
    // BackOffice
    {
      path: 'development',
      loadChildren: () => import('app/modules/development/development.module').then(m => m.DevelopmentModule) },
    // Custom Requirements
    {
      path: 'optica',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/optica/optica.module').then(m => m.OpticaModule) },
    {
      path: 'optika',
      canLoad: [ AuthGuard ],
      loadChildren: () => import('app/modules/shared-optica/shared-optica.module').then(m => m.SharedOpticaModule) },
    // It will be nice that this will be dinamic
    { path: '', redirectTo: 'crm/search', pathMatch: 'full' },
    { path: '404', component: PageNotFoundComponent, data: { title: ''} },
    { path: '**', component: PageNotFoundComponent, data: { title: ''} }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
