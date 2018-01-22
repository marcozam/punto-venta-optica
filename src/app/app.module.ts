import { BrowserModule, Title, DomSanitizer } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeESMX from '@angular/common/locales/es-MX';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

//AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

//Material2 Modules
import { 
  MatIconModule, 
  MatIconRegistry,
  MatListModule, 
  MatButtonModule, 
  MatMenuModule, 
  MatSidenavModule, 
  MatToolbarModule, 
  MatTabsModule,
  MatSelectModule,
  MatDialogModule,
} from '@angular/material';

//Material Tokens for Date format
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

//OS Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './containers/home/home.component';
//import { FacturacionComponent } from './modules/facturacion/facturacion.component';
//import { FacturaListComponent } from './modules/facturacion/factura-list.component';

//OS Modules
import { BaseModule } from './modules/base/base.module';
//Validate if should be here
import { DevelopmentModule } from './modules/development/development.module';
import { GenericCatalogsModule } from './modules/generic-catalogs/generic-catalogs.module';
import { ProductoModule } from './modules/producto/producto.module';
import { VentaModule } from './modules/venta/venta.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { CRMModule } from './modules/crm/crm.module';
import { OpticaModule } from './modules/optica/optica.module';



import { routing } from './app.routing';
import { DialogActionsComponent } from './components/dialog-actions/dialog-actions.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PreciosDetalleComponent } from './containers/precios-detalle/precios-detalle.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

registerLocaleData(localeESMX);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    //FacturacionComponent,
    //FacturaListComponent,
    DialogActionsComponent,
    LoginComponent,
    NotFoundComponent,
    PreciosDetalleComponent,
    PageNotFoundComponent,
    //ProductosComponent,
    //ProductosListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BrowserAnimationsModule,
    //Angular Material Modules
    MatIconModule, 
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    //Remove later
    MatSelectModule,
    //Angular Fire Modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    //OS Modules
    BaseModule,
    DevelopmentModule,
    GenericCatalogsModule,
    CRMModule,
    ProductoModule,
    VentaModule,
    PagosModule,
    InventarioModule,
    OpticaModule,
  ],
  providers: [
    Title,
    {provide: LOCALE_ID, useValue: 'es-MX'},
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    DialogActionsComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}