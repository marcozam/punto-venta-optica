import { Injectable } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { GeneralTicket } from 'app/modules/base/services/tickets/general-ticket';
import { ImpresionTicketService } from 'app/modules/base/services/tickets/impresion-ticket.service';
import { CorteCaja } from 'app/modules/pagos/models/caja.models';

@Injectable()
export class CorteTicketService extends ImpresionTicketService implements GeneralTicket {

    corte: CorteCaja;

    constructor(private _decimal: DecimalPipe, private _date: DatePipe) { super(); }

    getServerData(key: number) { throw new Error('Method not implemented.' + key); }

    createContent(): string {
        let content: string[] = [];
        content = content.concat([`<tr>
                <td colspan="2"><strong> Metodo Pago </strong></td>
                <td class="text-center"><strong> Rec. </strong></td>
                <td class="text-center"><strong> Dif. </strong></td>`])
        content = content.concat(this.corte.detalle.map(dc => {
            return `<tr>
                <td colspan="2">
                    ${dc.metodoPago.nombre}
                </td>
                <td class="text-right">
                    ${this._decimal.transform(dc.montoRecibido, '1.2-2')}
                </td>
                <td class="text-right">
                    ${this._decimal.transform(dc.diferencia, '1.2-2')}
                </td>
            </tr>`;
        }));
        return content.join('');
    }

    createHeader(): string {
        return `<tr><td colspan="4" class="text-center" style="font-size:12pt;">
                    <strong> Corte de Caja </strong>
                </td></tr>
                <tr>
                <td>
                    <b>Folio</b>
                </td>
                <th class="text-left">
                    ${this.corte.key}
                </th>
                <td colspan="2"class="text-right">
                    ${this._date.transform(this.corte.fechaCorte, 'dd/MM/yyyy HH:mm')}
                </td>
            </tr>
            <tr>
                <td><small><strong> Cajero </strong></small></td>
                <td colspan="3">
                    ${this.corte.usuario.nombre}
                </td>
            </tr>`;
    }

    createFooter(): string {
        return `<tr><td style="padding-top: 15px; border-top:dashed 1px #000" colspan="4"></td></tr>
        <tr>
            <td colspan="2" class="text-right"><b>Total Esperado</b></td>
            <td colspan="2"  class="text-right">
                $ ${this._decimal.transform(this.corte.totalEsperado, '1.2-2')}
            </td>
        </tr>
        <tr>
            <td colspan="2" class="text-right"><b>Total Recibido</b></td>
            <td colspan="2"  class="text-right">
                $ ${this._decimal.transform(this.corte.totalRecibido, '1.2-2')}
            </td>
        </tr>
        <tr>
            <td colspan="2" class="text-right"><b>Diferencia</b></td>
            <td colspan="2"  class="text-right">
                $ ${this._decimal.transform(this.corte.diferencia, '1.2-2')}
            </td>
        </tr>`;
    }

    print() { super.print(this, this.corte.sucursal); }
}
