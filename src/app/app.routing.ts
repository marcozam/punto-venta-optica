import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const appRoutes: Routes = [ 
    {
        path: 'DCG',
        loadChildren: 'app/modules/generic-catalogs/generic-catalogs.module#GenericCatalogsModule'
    },
    {
        path: 'productos',
        loadChildren: 'app/modules/producto/producto.module#ProductoModule'
    },
    {
        path: 'inventario',
        loadChildren: 'app/modules/inventario/inventario.module#InventarioModule'
    },
    {
        path: 'ventas',
        loadChildren: 'app/modules/venta/venta.module#VentaModule'
    },
    {
        path: 'crm',
        loadChildren: 'app/modules/crm/crm.module#CRMModule'
    },
    {
        path: 'development',
        loadChildren: 'app/modules/development/development.module#DevelopmentModule'
    },
    {
        path: 'optica',
        loadChildren: 'app/modules/optica/optica.module#OpticaModule'
    },
    {
        path: 'caja',
        loadChildren: 'app/modules/pagos/pagos.module#PagosModule'
    },
    //Home
    { path: '', redirectTo: 'crm/search', pathMatch: 'full' },
    { path: '404', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada'} },
    { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada'} }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);