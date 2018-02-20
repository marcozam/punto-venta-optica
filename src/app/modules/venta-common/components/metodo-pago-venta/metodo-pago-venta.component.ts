import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MetodoPago, DetallePagos, Venta } from 'app/modules/venta/models/venta.models';
import { MetodosPagoService } from '../../services/metodos-pago.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-metodo-pago-venta',
  templateUrl: './metodo-pago-venta.component.html',
  styleUrls: ['./metodo-pago-venta.component.scss'],
  providers: [MetodosPagoService]
})
export class MetodoPagoVentaComponent implements OnInit {

  totalPagado = 0;
  metodosPago: MetodoPago[];
  venta: Venta;
  @ViewChild('pagoForm') form: FormControl;

  constructor(
    private _metodoPagoService: MetodosPagoService,
    public dialogRef: MatDialogRef<MetodoPagoVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  createSubscriptions() {
    this._metodoPagoService.source$
      .subscribe(result => { this.metodosPago = result.filter(item => item.enVenta); });
  }

  ngOnInit() {
    this.createSubscriptions();
    this.venta = this.data.Venta;
    // Watch for changes
    this.form.valueChanges.subscribe(value => {
      const pagos: DetallePagos[] = this.convertToPagos(value);
      this.totalPagado = 0;
      if (pagos.length > 0) { this.totalPagado = pagos.map(p => p.totalRecibido).reduce((p, c) => p + c); }
    });

    this._metodoPagoService.getList();
  }

  onContinue(value) {
    const pagos: DetallePagos[] = this.convertToPagos(value);
    if (this.venta.sumary.saldo < this.totalPagado) {
      const pagoEfectivo = pagos.filter(p => p.metodoPago.key === 2)[0];
      if (pagoEfectivo) {
        pagoEfectivo.monto = pagoEfectivo.totalRecibido - this.totalPagado + this.venta.sumary.saldo;
      }
    }
    // TODO: Add validation depending on client
    this.dialogRef.close(pagos);
  }

  onCancelar() { this.dialogRef.close(); }

  convertToPagos(value) {
    const pagos = new Array<DetallePagos>();
    const keys = Object.keys(value);
    for (const k of keys){
      if (value[k] > 0) {
        const dp = new DetallePagos();
        dp.metodoPago = this.metodosPago.filter(mp => mp.key.toString() === k)[0];
        dp.totalRecibido = value[k];
        dp.monto = value[k];
        pagos.push(dp);
      }
    }
    return pagos;
  }
}
