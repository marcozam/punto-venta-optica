import { Component, OnInit } from '@angular/core';
import { VentaService } from 'app/modules/venta/services/venta.service';
import { Venta, DetallePagos } from 'app/modules/venta/models/venta.models';
import { DialogPagosService } from 'app/modules/venta/services/dialog-pagos.service';

@Component({
  selector: 'app-entregas-abonos',
  templateUrl: './entregas-abonos.component.html',
  styleUrls: ['./entregas-abonos.component.scss'],
  providers: [VentaService, DialogPagosService]
})
export class EntregasAbonosComponent implements OnInit {

  sucursalID: number;
  ordenesPendienteEntrega: Venta[];

  constructor(
    private ventaService: VentaService,
    private pagosDialog: DialogPagosService,
  ) { 
    
  }

  ngOnInit() {
    this.sucursalID = 1;
    this.ventaService.getOrdenesPendientesEntrega(this.sucursalID, res=>{
      this.ordenesPendienteEntrega = res;
    });
  }

  generarPago(venta: Venta){
    this.pagosDialog.openDialog(venta, (dp: DetallePagos[]) =>{
      this.ventaService.registarPago(Number(venta.sumary.key), dp, res=> console.log(res));
    });
  }
}
