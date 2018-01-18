import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { GeneralTicket } from 'app/modules/base/services/tickets/general-ticket';
import { ImpresionTicketService } from 'app/modules/base/services/tickets/impresion-ticket.service';
import { Venta } from 'app/modules/venta/models/venta.models';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { Examen } from 'app/modules/optica/models/examen.models';
import { ExamenService } from 'app/modules/optica/services/examen.service';

@Injectable()
export class VentaTicketService extends ImpresionTicketService implements GeneralTicket {

  corteID: number;
  esPagoInicial: boolean = true;
  esPresupuesto: boolean = false;
  venta: Venta;

  constructor(
    public service: VentaService, 
    public _decimal: DecimalPipe, 
    public _date: DatePipe) { 
    super();
  }

  print(){
    super.print(this, this.venta.sumary.sucursal);
  }

  getServerData(key: number){
    this.service.getByID(key)
        .subscribe((data: Venta) => { 
            this.venta = data;
            this.print();
        });
  }

  createAditionalContent() { return ''; }

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
          <td colspan="2">
            ${dPro.productoVenta.nombre}
            ${dPro.comentario ? `<br/><small>(${dPro.comentario})</small>`: ''}
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
    </tr>`;
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

    let totalRecibido: number = pagos.length > 0 ? 
        pagos.map(p=> p.totalRecibido).reduce((p, c)=> p +c) : 0;

    let anticipo: number = 0;

    if(!this.esPagoInicial){
      anticipo = this.venta.pagos
        .filter(p=> p.esPagoInicial || p.corteID > 0)
        .map(p=> p.monto)
        .reduce((p, c)=> p +c);

      footer.push(`<tr>
          <td colspan="3">
            Anticipo
          </td>
          <td class="text-right">
            $ ${this._decimal.transform(anticipo, '1.2-2')}
          </td>
        </tr>`);
    }
    totalRecibido += anticipo;

    footer = footer.concat(
      pagos
      .map( dPag => {
        return `<tr>
          <td colspan="3">
            ${dPag.metodoPago.nombre}
          </td>
          <td class="text-right">
            $ ${ this._decimal.transform(dPag.totalRecibido, '1.2-2')}
          </td>
        </tr>`
      })
    );

    footer.push(`<tr>
      <td colspan="3">
        <strong>
          ${ this.venta.sumary.total > this.venta.sumary.totalPagado ? 'Saldo Actual' : 'Su Cambio'}
        </strong>
      </td>
      <td class="text-right">
        $ ${ this._decimal.transform(
            this.venta.sumary.total <= this.venta.sumary.totalPagado ? 
            (totalRecibido - this.venta.sumary.total) : 
            (this.venta.sumary.total - totalRecibido),
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
