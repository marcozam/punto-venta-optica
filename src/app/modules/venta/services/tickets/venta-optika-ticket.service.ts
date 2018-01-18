import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { VentaTicketService } from 'app/modules/venta/services/tickets/venta-ticket.service';
import { Venta } from 'app/modules/venta/models/venta.models';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { Examen } from 'app/modules/optica/models/examen.models';
import { ExamenService } from 'app/modules/optica/services/examen.service';

@Injectable()
export class VentaOptikaTicketService extends VentaTicketService {

  corteID: number;
  esPagoInicial: boolean = true;
  esPresupuesto: boolean = false;
  venta: Venta;
  examen: Examen;

  constructor(
    service: VentaService, 
    _decimal: DecimalPipe, 
    _date: DatePipe,
    private serviceExamen: ExamenService) { 
    super(service, _decimal, _date);
  }

  getServerData(key: number){
    this.service.getByID(key)
        .subscribe((data: Venta) => { 
            this.venta = data;
            this.serviceExamen.getLastExamen(this.venta.sumary.cliente.key)
              .subscribe((examen: Examen) => {
                examen ? this.examen = examen : this.examen = undefined;
                this.print();
              });
        });
  }

  createHeader(){
    return super.createHeader() + (this.examen ? this.createAditionalContent(): '');
  }

  createAditionalContent(){
    return `
      <tr>
        <td style="padding-top: 15px; border-top:dashed 1px #000" colspan="4"></td>
      </tr>
      <tr>
        <td colspan="2"></td>
        <td class="text-center">
          <strong>O.D.</strong>
        </td>
        <td class="text-center">
          <strong>O.I.</strong>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          ESF. <small>(SPH)</small>
        </td>
        <td class="text-center">
          ${this.examen.ojoDerecho.esfera}
        </td>
        <td class="text-center">
          ${this.examen.ojoIzquierdo.esfera}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          CILINDRO
        </td>
        <td class="text-center">
          ${this.examen.ojoDerecho.cilindro}
        </td>
        <td class="text-center">
          ${this.examen.ojoIzquierdo.cilindro}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          EJE
        </td>
        <td class="text-center">
          ${this.examen.ojoDerecho.grados}
        </td>
        <td class="text-center">
          ${this.examen.ojoIzquierdo.grados}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          DISTANCIA
        </td>
        <td class="text-center">
          ${this.examen.ojoDerecho.distanciaInterPupilar}
        </td>
        <td class="text-center">
          ${this.examen.ojoIzquierdo.distanciaInterPupilar}
        </td>
      </tr>
      <tr>
        <td colspan="2">
          ADICION
        </td>
        <td colspan="2" class="text-center">
          ${this.examen.adicion ? this.examen.adicion : '' }
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <strong>OBSERVACIONES</strong>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          ${this.examen.observaciones}
        </td>
      </tr>
      `
  }
}
