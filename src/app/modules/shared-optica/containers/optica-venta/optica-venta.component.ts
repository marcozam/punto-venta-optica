import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { VentaOptica } from '../../models/venta-optica';

// 999 => Armazon
// 998 => Mica
// 997 => Tratamientos
// 995 => Medidas

@Component({
  selector: 'app-optica-venta',
  templateUrl: './optica-venta.component.html',
  styleUrls: ['./optica-venta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpticaVentaComponent extends VentaOptica implements OnInit {

  ventaMica = false;
  showOptica = true;
  @Input() clienteID: number;
  @Input() listaPrecioID: number;

  constructor() { super(); }

  ngOnInit() { }

  isVentaInvalid() {
    let rval = true;
    if (this.venta.detalle.length > 0) {
      rval = false;
      if (this.showOptica) {
        const mica = this.venta.detalle.find(d => d.productoVenta.key === 999999);
        if (mica) { rval = this.venta.comentarios.filter(c => c.moduleID === 995).length === 0; }
      }
    }
    return rval;
  }

  onExamenChanged(value) {
    this.showOptica = value ? true :  false;
    super.onExamenChanged(value);
  }
}
