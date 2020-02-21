import { GeneralTicket } from 'app/modules/base/services/tickets/general-ticket';
import { Sucursal } from 'models';

export abstract class ImpresionTicketService {

  constructor() { }

  private createTicket(header: string, content: string) {
    return `<html>
      <head>
        <title>Print tab</title>
        <style>
          body{
            width: 300px;
            font-family: consolas;
            text-transform: uppercase;
          }
          table{
            width: 100%;
            font-size: 1em;
          }
          .text-left{
            text-align: left;
          }
          .text-center{
            text-align: center;
          }
          .text-right{
            text-align: right;
          }
          .ticket-impresion{
            width: 300px;
          }
        </style>
      </head>
      <body>
        ${header}
        ${content}
      </body>
      <script>
        window.print();
        window.close();
      </script>
    </html>`
  }

  private createTicketHeader(sucursal: Sucursal, optinalHeader?: string){
    return `<table>
      <thead>
        <tr>
          <th style="font-size:13pt;" colspan="4">
            <h2>${sucursal.companyName}</h2>
          </th>
        </tr>
        <tr>
          <th colspan="4">
              ASOCIACION OPTIKA GHC
              <br/> AOG1708108WA
              <br/> Sucursal: ${sucursal.nombre}
              <br/> TEL: (667) 716-14-93
          </th>
        </tr>
        <tr>
            <th colspan="4">
              DONATO GUERRA #580 COL. CENTRO
              <br/><br/>
            </th>
        </tr>
        ${optinalHeader ? optinalHeader : ''}
        <tr>
          <td style="padding-top: 15px; border-bottom:dashed 1px #000" colspan="4"></td>
        </tr>
      </thead>
    </table>`
  }

  createTicketFooter(footer: string){
    return `<tfoot>
      ${footer}
      <tr>
        <td style="padding-bottom: 15px; border-top:dashed 1px #000" colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4" class="text-center" style="padding: 20px 0px;">
          <strong>¡Gracias por su visita!</strong><br/>
          <strong>Lo esperamos pronto ...</strong>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px; border-top:dashed 1px #000" colspan="4"></td>
      </tr>
    </tfoot>`
  }

  createTicketContent(content: string, footer: string){
    return `<table>
      <tbody>
        ${content}
      </tbody>
      ${this.createTicketFooter(footer)}
    </table>`;
  }

  print(service: GeneralTicket, sucursal: Sucursal){
    let ticket: string = this.createTicket(
      this.createTicketHeader(sucursal, service.createHeader()),
      this.createTicketContent(service.createContent(), service.createFooter())
    );

    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(ticket);
  }
}
