import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule, Title, DomSanitizer } from '@angular/platform-browser';
import localeESMX from '@angular/common/locales/es-MX';

// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Material Tokens for Date format
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Routing
import { AppRoutingModule } from './routing/app.routing';
// Componentes
import { AppComponent } from './app.component';
import { SucursalSelectionComponent } from './sucursal-selection/sucursal-selection.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DialogBoxComponent } from './modules/base/components/dialog-box/dialog-box.component';
// Services
import { SucursalService } from './services/http';

registerLocaleData(localeESMX);

@NgModule({
  declarations: [
    AppComponent,
    DialogBoxComponent,
    PageNotFoundComponent,
    SucursalSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Angular Material
    MatSnackBarModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    Title,
    SucursalService,
    {provide: LOCALE_ID, useValue: 'es-MX'},
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    SucursalSelectionComponent,
    DialogBoxComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
