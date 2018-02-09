import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from 'environments/environment';

import {
  MatButtonModule, 
  MatSelectModule, 
  MatIconModule, 
  MatInputModule, 
  MatListModule, 
  MatFormFieldModule, 
  MatRadioModule,
  MatCheckboxModule,
  MatProgressBarModule,
 } from '@angular/material';

import { OpticaRoutingModule } from './optica-routing.module';

//OS Modules
import { BaseModule } from '../base/base.module';

//Services
import { ExamenService } from './services/examen.service';
import { ProductosService } from '../producto/services/productos.service';
//Components
import { ExamenComponent } from './containers/examen/examen.component';
import { GraduacionComponent } from './components/graduacion/graduacion.component';
import { OjoComponent } from './components/ojo/ojo.component';
import { PrecioMaterialComponent } from './components/precio-material/precio-material.component';
import { GraduacionVistaComponent } from './components/graduacion-vista/graduacion-vista.component';
import { MarcaArmazonComponent } from './components/marca-armazon/marca-armazon.component';
import { ModeloArmazonComponent } from './components/modelo-armazon/modelo-armazon.component';
import { PrecioCategoriaArmazonComponent } from './components/precio-categoria-armazon/precio-categoria-armazon.component';
import { ArmazonSelectionComponent } from './components/armazon-selection/armazon-selection.component';
import { OpticaVentaComponent } from './containers/optica-venta/optica-venta.component';
import { TipoMicaComponent } from './components/tipo-mica/tipo-mica.component';
import { ModeloAramazonListComponent } from './components/modelo-aramazon-list/modelo-aramazon-list.component';
import { MedidasArmazonComponent } from './components/medidas-armazon/medidas-armazon.component';
import { ExamenPresupuestoComponent } from './containers/examen-presupuesto/examen-presupuesto.component';
//FireBase
import { AngularFireDatabase } from 'angularfire2/database';
import { TipoArmazonComponent } from './components/tipo-armazon/tipo-armazon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OpticaRoutingModule,
    //OS Module
    BaseModule,
    //Angular Material
    MatButtonModule, 
    MatProgressBarModule,
    MatSelectModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    //Angular Fire Modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  declarations: [
    OjoComponent, 
    ExamenComponent,
    GraduacionComponent,
    PrecioMaterialComponent,
    GraduacionVistaComponent,
    MarcaArmazonComponent,
    ModeloArmazonComponent,
    PrecioCategoriaArmazonComponent,
    ArmazonSelectionComponent,
    OpticaVentaComponent,
    TipoMicaComponent,
    ModeloAramazonListComponent,
    MedidasArmazonComponent,
    ExamenPresupuestoComponent,
    TipoArmazonComponent
  ],
  providers: [
    ExamenService, 
    ProductosService,
    AngularFireDatabase
  ],
  exports: [
    ExamenComponent, 
    GraduacionComponent, 
    PrecioCategoriaArmazonComponent, 
    PrecioMaterialComponent,
    OpticaVentaComponent
  ]
})
export class OpticaModule { }
