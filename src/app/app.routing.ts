import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { HomeComponent } from './containers/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PreciosDetalleComponent } from './containers/precios-detalle/precios-detalle.component';
//import { FacturaListComponent } from './modules/facturacion/factura-list.component';
//import { FacturacionComponent } from './modules/facturacion/facturacion.component';

const appRoutes: Routes = [ 
    {
        path: 'DCG',
        loadChildren: 'app/modules/generic-catalogs/generic-catalogs.module#GenericCatalogsModule'
    },
    {
        path: 'productos',
        loadChildren: 'app/modules/producto/producto.module#ProductoModule'
    },


    //Home
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: 'Inicio' } },
    //Should be on Producto Module??
    { path: 'lista-precios', component: PreciosDetalleComponent, data: { title: 'Lista de Precios' } },
    //Facturacion
    //{ path: 'facturacion', component: FacturacionComponent, data: { title: 'Facturacion' } },
    //{ path: 'facturacion/list', component: FacturaListComponent, data: { title: 'Lista de Facturas' } },
    { path: '404', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada'} },
    { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada'} }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);