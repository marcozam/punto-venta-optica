import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title, DomSanitizer } from '@angular/platform-browser';
import localeESMX from '@angular/common/locales/es-MX';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Material2 Modules
import { MatIconRegistry, MatSidenavModule, MatMenuModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';

//Material Tokens for Date format
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

//OS Componentes
import { AppComponent } from './app.component';

import { routing } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

registerLocaleData(localeESMX);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    routing,
    BrowserAnimationsModule,
    HttpClientModule,
    //Angular Material
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule, 
    MatIconModule, 
    MatButtonModule
  ],
  providers: [
    Title,
    {provide: LOCALE_ID, useValue: 'es-MX'},
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}