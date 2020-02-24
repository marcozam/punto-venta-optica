
import { Sucursal } from 'models';
import { OpticaVentaChangeEvent } from '../models/optica-venta.models';
import { Examen } from 'app/modules/optica/models/examen.models';
import { Venta, Usuario } from 'app/modules/venta/models/venta.models';
import { OnInit } from '@angular/core';
import { ApplicationService } from 'app/services';

export abstract class VentaOptica implements OnInit {
    venta: Venta;
    clienteID: number;
    listaPrecioID: number;
    sucursalID: number;
    examen: Examen;

    constructor(private applicationService: ApplicationService) { }

    ngOnInit() {
      const { sucursal, user } = this.applicationService;
      this.venta = new Venta(sucursal, user);
      this.venta.sumary.key = 0;
    }

    onOpticaVentaChanged(data: OpticaVentaChangeEvent) {
        if (data.isRemove) {
            this.venta.updateDetalleVenta(
                this.venta.detalle
                    .filter(cdv => data.detalle.findIndex(rdv => rdv.productoVenta.key === cdv.productoVenta.key) < 0),
                false);
        } else { this.venta.updateDetalleVenta(data.detalle); }
        this.venta.comentarios = this.venta.comentarios.filter(c => c.moduleID !== 999 && c.moduleID !== 998 && c.moduleID !== 995).concat(data.comentarios);
    }

    onExamenChanged(value: Examen) { if (value) { this.examen = value; } }
}
