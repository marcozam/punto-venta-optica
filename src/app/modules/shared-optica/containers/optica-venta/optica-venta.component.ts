import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
// Models
import { Venta } from 'app/modules/venta/models/venta.models';
import { Contacto } from 'app/modules/crm/models/crm.models';
import { VentaOptica } from '../../models/venta-optica';
// Services
import { ExamenService } from 'app/modules/optica/services/examen.service';

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
  paciente: Contacto;
  @Input() clienteID: number;
  @Input() listaPrecioID: number;

  constructor(private _service: ExamenService) { super(); }

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

  onSaved(venta: Venta) {
    this._service.saveVentaExamen(venta.sumary.key, this.examen.key,
      this.examen.materialRecomendadoID, this.examen.tipoMicaRecomendadoID)
      .subscribe(() => {
        alert('All saved');
        // Redirect to home
      });
  }
}
