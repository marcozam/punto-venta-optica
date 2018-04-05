import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
// Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
// OS Modules
import { BaseModule } from 'app/modules/base/base.module';
// Routing
import { VentaCommonRoutingModule } from './venta-common-routing.module';
// Services
import { VentaService } from 'app/modules/venta/services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { ExamenService } from 'app/modules/optica/services/examen.service';
// Components
import { ListaVentasComponent } from './components/lista-ventas/lista-ventas.component';
import { MetodoPagoVentaComponent } from './components/metodo-pago-venta/metodo-pago-venta.component';
import { ResumenVentaMesComponent } from './containers/resumen-venta-mes/resumen-venta-mes.component';
import { ResumenVentaProductosComponent } from './containers/resumen-venta-productos/resumen-venta-productos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // OS Modules
    BaseModule,
    // Routing
    VentaCommonRoutingModule,
    // Material
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  declarations: [
    ResumenVentaMesComponent,
    ListaVentasComponent,
    MetodoPagoVentaComponent,
    ResumenVentaProductosComponent
  ],
  exports: [
    ListaVentasComponent
  ],
  providers: [
    VentaService,
    ContactoService,
    ExamenService,
    DecimalPipe,
    DatePipe
  ],
  entryComponents: [
    MetodoPagoVentaComponent
  ]
})
export class VentaCommonModule { }
