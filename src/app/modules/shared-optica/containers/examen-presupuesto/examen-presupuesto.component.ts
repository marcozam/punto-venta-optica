import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
// RxJs
import { switchMap } from 'rxjs/operators';
// Models
import { VentaOptica } from '../../models/venta-optica';
import { Venta, Usuario } from 'app/modules/venta/models/venta.models';
import { Examen } from 'app/modules/optica/models/examen.models';
// Services
import { ApplicationService } from 'app/services';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { VentaOptikaTicketService } from 'app/modules/venta/services/tickets/venta-optika-ticket.service';

@Component({
  selector: 'app-examen-presupuesto',
  templateUrl: './examen-presupuesto.component.html',
  styleUrls: ['./examen-presupuesto.component.scss'],
  providers: [
    ContactoService,
    VentaOptikaTicketService,
    DecimalPipe,
    DatePipe
  ],
})
export class ExamenPresupuestoComponent extends VentaOptica implements OnInit {

  listaPrecioID: number;
  clienteID: number;
  venta: Venta;
  loading = true;
  vendeor: Usuario;


  constructor(
    applicationService: ApplicationService,
    private contactoService: ContactoService,
    private _printService: VentaOptikaTicketService,
    private route: ActivatedRoute) {
    super(applicationService);
  }

  ngOnInit() {
    this.listaPrecioID = 1;
    this.route.params
      .pipe(
        switchMap(({ pacienteID }) => this.contactoService.getByID(pacienteID)))
      .subscribe(data => {
        super.ngOnInit();
        this.venta.sumary.cliente = data;
      });
  }

  print() {
    this._printService.venta = this.venta;
    this._printService.examen = this.examen;
    this._printService.esPresupuesto = true;
    this._printService.print();
  }

  onExamenChange(examen: Examen) {
    this.loading = examen ? false : true;
  }
}
