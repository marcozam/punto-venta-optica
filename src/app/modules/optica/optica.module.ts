import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { environment } from 'environments/environment';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { OpticaRoutingModule } from './optica-routing.module';

// OS Modules
import { BaseModule } from '../base/base.module';
import { ProductoModule } from '../producto/producto.module';
// Services
import { ExamenService } from './services/examen.service';
import { ProductosService } from '../producto/services/productos.service';
// Components
import { ExamenComponent } from './containers/examen/examen.component';
import { GraduacionComponent } from './components/graduacion/graduacion.component';
import { OjoComponent } from './components/ojo/ojo.component';
import { PrecioMaterialComponent } from './components/precio-material/precio-material.component';
import { GraduacionVistaComponent } from './components/graduacion-vista/graduacion-vista.component';
import { MarcaArmazonComponent } from './components/marca-armazon/marca-armazon.component';
import { ModeloArmazonComponent } from './components/modelo-armazon/modelo-armazon.component';
import { PrecioCategoriaArmazonComponent } from './components/precio-categoria-armazon/precio-categoria-armazon.component';
import { ArmazonSelectionComponent } from './components/armazon-selection/armazon-selection.component';
import { TipoMicaComponent } from './components/tipo-mica/tipo-mica.component';
import { ModeloAramazonListComponent } from './components/modelo-aramazon-list/modelo-aramazon-list.component';
import { MedidasArmazonComponent } from './components/medidas-armazon/medidas-armazon.component';
import { TipoArmazonComponent } from './components/tipo-armazon/tipo-armazon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OpticaRoutingModule,
    // OS Module
    BaseModule,
    ProductoModule,
    // Angular Material
    MatFormFieldModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    /*
    MatListModule,
    MatTabsModule,
    */
    // Angular Fire Modules
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
    TipoMicaComponent,
    ModeloAramazonListComponent,
    MedidasArmazonComponent,
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
    ArmazonSelectionComponent,
    PrecioMaterialComponent
  ]
})
export class OpticaModule { }
