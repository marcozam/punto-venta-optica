import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { GenericTicketService } from 'app/modules/venta/services/generic-ticket-service';
import { Venta } from 'app/modules/venta/models/venta.models';
import { ImpresionTicketService } from 'app/modules/venta/services/impresion-ticket.service';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { Examen } from 'app/modules/optica/models/examen.models';
import { ExamenService } from 'app/modules/optica/services/examen.service';

@Injectable()
export class VentaTicketService extends ImpresionTicketService implements GenericTicketService {

  corteID: number;
  esPagoInicial: boolean = true;
  esPresupuesto: boolean = false;
  venta: Venta;
  examen: Examen;

  constructor(
    private service: VentaService, 
    private serviceExamen: ExamenService,
    private _decimal: DecimalPipe, 
    private _date: DatePipe) { 
    super();
  }

  print(){
    super.print(this, this.venta.sumary.sucursal);
  }

  getServerData(key: number){
    this.service.getByID(key, (data: Venta) => { 
      this.venta = data;
      //Exclusivo Optica
      this.serviceExamen.getLastExamen(this.venta.sumary.cliente.key).subscribe((examen: Examen) => {
        examen ? this.examen = examen : this.examen = undefined;
        this.print();
      });
    });
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

  createComments(){
    //Agrega comentarios a los productos
    this.venta.updateDetalleVenta(this.venta.detalle.map(dv=>{
      let comentarios = this.venta.comentarios.filter(c=> c.productoID === dv.productoVenta.key);
      if(comentarios.length > 0){
        dv.comentario = comentarios.map(c=> c.comentario).join('<br/>');
      }
      return dv;
    }));
    //Elimina los comentarios de productos
    this.venta.comentarios = this.venta.comentarios.filter(c=> c.productoID === 0 || c.productoID === null);
    return this.venta.comentarios.map(cm => {
        return `<tr>
          <td colspan="4">
            ${cm.comentario}
          </td>
        </tr>`
      })
  }

  createContent() {
    let comentarios = this.createComments();
    let content: string[] = []
    content = content.concat(
      this.venta.detalle.map(dPro => {
        return `<tr>
          <td class="text-center">
            ${dPro.cantidad}
          </td>
          <td>
            ${dPro.productoVenta.nombre}
            ${dPro.comentario ? `<br/><small>(${dPro.comentario})</small>`: ''}
          </td>
          <td class="text-right">
            ${this._decimal.transform(dPro.precioUnitario, '1.2-2')}
          </td>
          <td class="text-right">
            ${this._decimal.transform(dPro.importe, '1.2-2')}
          </td>
        </tr>`;
      })
    );
    if(this.venta.comentarios.length > 0){
      content.push(`<tr>
          <td style="padding-top: 15px; border-top:dashed 1px #000" colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4">
            <strong>Comentarios</strong>
          </td>
        </tr>`);
    }
    content = content.concat(comentarios);
    return content.join('');
  }

  createHeader(){
    return `
    <tr>
      <td colspan="4" class="text-center" style="font-size:12pt;">
        <strong>
          ${ this.esPresupuesto ? 'Presupuesto' : this.esPagoInicial ? 'Orden Venta' : 'Abono'}
        </strong>
      </td>
    </tr>
    <tr>
      <td>
        <b>Folio</b>
      </td>
      <th class="text-left">
        ${this.venta.sumary.key}
      </th>
      <td colspan="2" style="text-align:right">
        ${this._date.transform(this.venta.sumary.fecha, 'dd/MM/yyyy HH:mm')}
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          Cliente
        </strong>
      </td>
      <td colspan="3">
        ${this.venta.sumary.cliente.nombre}
      </td>
    </tr>
    ${this.venta.sumary.cliente.datos
        .filter(dc=>dc.tipoContactoID <= 3)
        .map(dc=>{
          return `
          <tr>
            <td>
              <small>
                ${dc.nombre}
              </small>
            </td>
            <td colspan="3">
              <small>
                ${dc.valor}
              </small>
            </td>
          </tr>`
        })
        .join('')}
    <tr>
      <td>
        <small>
          <strong>
            Lo Atendio
          </strong>
        </small>
      </td>
      <td colspan="3">
        ${this.venta.sumary.vendedor.nombre}
      </td>
    </tr>
    ${this.examen ? this.createAditionalContent() : ''}`;
  }

  createDetallePagos(){
    let footer: string [] = [];
    `<tr>
      <td style="padding-top:15px; border-bottom:dashed 1px #000" colspan="4"></td>
    </tr>
      ${this.venta.pagos.length > 0 ? 
      `<tr>
        <th style="padding-top:15px;" colspan="4">SUS PAGOS</th>
      </tr>` 
      : ''
    }`

    let pagos = this.venta.pagos.filter(
      dPag => {
        return this.esPagoInicial ? dPag.esPagoInicial : dPag.corteID === this.corteID && !dPag.esPagoInicial;
      }
    );

    let anticipo: number = 0;

    if(!this.esPagoInicial){
      anticipo = this.venta.pagos
        .filter(p=> p.esPagoInicial || p.corteID > 0)
        .map(p=> p.monto)
        .reduce((p, c)=> p +c);

      footer.push(`<tr>
          <td colspan="2">
            Anticipo
          </td>
          <td colspan="2" class="text-right">
            $ ${this._decimal.transform(anticipo, '1.2-2')}
          </td>
        </tr>`);
        anticipo = 0;
    }
    else{
      let iniPayments = this.venta.pagos
        .filter(p=> !p.esPagoInicial)
        .map(p=> p.monto);

      if(iniPayments.length > 0){
        anticipo = iniPayments.reduce((p, c)=> p +c);
      }
    }

    footer = footer.concat(
      pagos
      .map( dPag => {
        return `<tr>
          <td colspan="2">
            ${dPag.metodoPago.nombre}
          </td>
          <td colspan="2" class="text-right">
            $ ${ this._decimal.transform(dPag.monto, '1.2-2')}
          </td>
        </tr>`
      })
    );

    footer.push(`<tr>
      <td colspan="2">
        <strong>
          ${ this.venta.sumary.total > this.venta.sumary.totalPagado ? 'Saldo Actual' : 'Su Cambio'}
        </strong>
      </td>
      <td colspan="2" class="text-right">
        $ ${ this._decimal.transform(
            this.venta.sumary.total <= this.venta.sumary.totalPagado ? 
            (this.venta.sumary.totalPagado - anticipo - this.venta.sumary.total) : 
            (this.venta.sumary.total + anticipo - this.venta.sumary.totalPagado),
            '1.2-2')
        }
      </td>
    </tr>`);

    return footer.join('');
  }

  createFooter() {
    let footer: string [] = [];
    footer.push(`<tr>
          <td style="padding-top: 15px; border-top:dashed 1px #000" colspan="4"></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align:right;">
          <b>Sub-Total</b>
        </td>
        <td colspan="2" style="text-align:right;">
          $ ${this._decimal.transform(this.venta.sumary.subTotal, '1.2-2')}
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:right;">
        <b>Impuestos</b>
      </td>
      <td colspan="2" style="text-align:right;">
        $ ${this._decimal.transform(this.venta.sumary.impuestos, '1.2-2')}
      </td>
    </tr>
    <tr>
        <td colspan="2" style="text-align:right;">
          <b>Total</b>
        </td>
        <td colspan="2" style="text-align:right;">
          $ ${this._decimal.transform(this.venta.sumary.total, '1.2-2')}
        </td>
      </tr>
      <tr>
        <td></td>
        <td colspan="2" style="text-align:right;">
          <strng>No Articulos</strong>
        </td>
        <td style="text-align:right;">
          ${this.venta.detalle.length}
        </td>
      </tr>`);
      
      if(!this.esPresupuesto)
        footer.push(this.createDetallePagos());
      
      return footer.join('');
  }
}
