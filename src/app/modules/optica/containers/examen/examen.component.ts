import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Contacto } from 'app/modules/crm/models/crm.models';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { GraduacionEventChange } from 'app/modules/optica/components/graduacion/graduacion.component';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss'],
  providers: [ContactoService]
})
export class ExamenComponent implements OnInit {

  pacienteID: number;
  paciente: Contacto;

  constructor(
    private route: ActivatedRoute,
    private _route: Router,
    private _pacienteService: ContactoService) {
      this.paciente = new Contacto();
    }

  ngOnInit() {
    this.pacienteID = this.route.snapshot.params['pacienteID'];
    this._pacienteService.getByID(this.pacienteID).subscribe(data => this.paciente = data);
  }

  onMicaSaved(event: GraduacionEventChange) {
    if (event.action === 'venta') {
      this._route.navigateByUrl('/optika/venta/' + this.pacienteID);
    } else if (event.action === 'presupuesto') {
      this._route.navigateByUrl('/optika/presupuesto/' + this.pacienteID);
    }
  }
}
