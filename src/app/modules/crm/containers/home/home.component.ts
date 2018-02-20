import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogActionsComponent } from '../../components/dialog-actions/dialog-actions.component';

import { Contacto } from 'app/modules/crm/models/crm.models';
import { Venta } from 'app/modules/venta/models/venta.models';

import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { VentasReportingService } from 'app/modules/venta-common/services/ventas-reporting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ContactoService, VentasReportingService]
})
export class HomeComponent {

  private ordenesPendientes: Venta[] = [];

  constructor(
    public dialog: MatDialog,
    private _route: Router,
    private _ventaService: VentasReportingService,
    private _contactoService: ContactoService) {}

  onPersonaChange(item: any) {
    if (item.data.key === 0) {
      this._contactoService.save(item.data).subscribe((data: Contacto) => this.checkData(data));
    } else {
      if (item.exist) {
        this.checkData(item.data);
      } else {
        this._route.navigateByUrl('/optica/examen/' + item.data.key);
      }
    }
  }

  checkData(_contacto: Contacto) {
    this._ventaService.getOrdenesPendientesEntrega(0, _contacto.key)
      .subscribe(result => {
        this.ordenesPendientes = result;
        this.openDialog(_contacto);
      });
  }

  openDialog(_contacto: Contacto, _onClose?: any) {
    const _actions = [
      { name: 'Realizar examen', route: '/optika/examen/' + _contacto.key },
      { name: 'Generar venta', route: '/optika/venta/' + _contacto.key },
      /*{ name: 'Historial de Compra', route: '/crm/historial/' + _contacto.key },*/
    ];

    if (this.ordenesPendientes.length > 0) {
      _actions.push({ name: `Ordenes por Entregar (${this.ordenesPendientes.length})`, route: '/caja/entregas/' + _contacto.key });
    }

    const dialogRef = this.dialog.open(DialogActionsComponent, {
      data: { title: _contacto.nombre, actions: _actions }
    });

    if (_onClose) {
      dialogRef.afterClosed().subscribe(result => { _onClose(result); });
    }
  }
}
