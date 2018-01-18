import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ventas-pendientes-entrega',
  templateUrl: './ventas-pendientes-entrega.component.html',
  styleUrls: ['./ventas-pendientes-entrega.component.scss']
})
export class VentasPendientesEntregaComponent implements OnInit {

  sucursalID: number;
  clienteID: number;
  opcion: string = 'pendientes-entrega';

  constructor(private route: ActivatedRoute,
    private router : Router) { }

  ngOnInit() {
    this.sucursalID = 1;
    if(this.router.url.indexOf('crm/historial') >= 0) this.opcion = 'historial';
    let clienteID = this.route.snapshot.params['clienteID'];
    this.clienteID = clienteID ? clienteID : 0;
  }

}
