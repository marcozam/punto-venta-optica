import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const appRoutes: Routes = [
    // Core
    { path: 'productos', loadChildren: 'app/modules/producto/producto.module#ProductoModule' },
    { path: 'inventario', loadChildren: 'app/modules/inventario/inventario.module#InventarioModule' },
    { path: 'ventas', loadChildren: 'app/modules/venta/venta.module#VentaModule' },
    { path: 'crm', loadChildren: 'app/modules/crm/crm.module#CRMModule' },
    { path: 'caja', loadChildren: 'app/modules/pagos/pagos.module#PagosModule' },
    // Reporting
    { path: 'reporting/ventas', loadChildren: 'app/modules/venta-reporting/venta-reporting.module#VentaReportingModule' },
    // Base
    { path: 'DCG', loadChildren: 'app/modules/generic-catalogs/generic-catalogs.module#GenericCatalogsModule' },
    // BackOffice
    { path: 'development', loadChildren: 'app/modules/development/development.module#DevelopmentModule' },
    // Custom Requirements
    { path: 'optica', loadChildren: 'app/modules/optica/optica.module#OpticaModule' },
    { path: 'optika', loadChildren: 'app/modules/shared-optica/shared-optica.module#SharedOpticaModule' },
    // It will be nice that this will be dinamic
    { path: '', redirectTo: 'crm/search', pathMatch: 'full' },
    { path: '404', component: PageNotFoundComponent, data: { title: ''} },
    { path: '**', component: PageNotFoundComponent, data: { title: ''} }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
