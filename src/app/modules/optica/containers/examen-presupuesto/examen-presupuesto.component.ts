import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Contacto } from 'app/modules/crm/models/crm.models';

import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { VentaOptikaTicketService } from 'app/modules/venta/services/tickets/venta-optika-ticket.service';
import { VentaOptica } from 'app/modules/optica/models/venta-optica';
import { Venta } from 'app/modules/venta/models/venta.models';
import { Examen } from 'app/modules/optica/models/examen.models';

@Component({
  selector: 'app-examen-presupuesto',
  templateUrl: './examen-presupuesto.component.html',
  styleUrls: ['./examen-presupuesto.component.scss'],
  providers: [
    ContactoService,
    VentaOptikaTicketService
  ]
})
export class ExamenPresupuestoComponent extends VentaOptica implements OnInit {

  listaPrecioID: number;
  sucursalID: number;
  clienteID: number;
  venta: Venta;
  loading: boolean = true;

  constructor(
    private _contactoService: ContactoService,
    private _printService: VentaOptikaTicketService,
    private route: ActivatedRoute) { 
    super();
  }

  ngOnInit() {
    this.listaPrecioID = 1;
    this.sucursalID = 1;
    this.clienteID = this.route.snapshot.params['pacienteID'];

    this.venta = new Venta();

    //Obtiene el paciente
    if(this.clienteID){
      this._contactoService.getByID(this.clienteID)
        .subscribe((data: Contacto) => {
          this.venta.sumary.cliente = data;
        });
    }
  }

  print(){
    this._printService.venta = this.venta;
    this._printService.examen = this.examen;
    this._printService.esPresupuesto = true;
    this._printService.print();
  }

  onExamenChanged(examen: Examen){
    this.loading = examen ? false: true;
  }
}
