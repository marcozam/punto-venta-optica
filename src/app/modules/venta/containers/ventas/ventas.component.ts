import { Component, DebugElement, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { MatSelectionList } from '@angular/material';
import { MatDialog } from '@angular/material';

import { Producto } from 'app/modules/producto/models/producto.models';
import { Contacto } from 'app/modules/crm/models/crm.models';
import { Venta, DetalleVenta, DetallePagos, MetodoPago } from '../../models/venta.models';

import { VentaService } from '../../services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { InventarioService } from 'app/modules/inventario/services/inventario.service';
import { DialogPagosService } from 'app/modules/pagos/services/dialog-pagos.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

import { Examen } from 'app/modules/optica/models/examen.models';
import { ImpresionTicketService } from 'app/modules/venta/services/impresion-ticket.service';
import { VentaTicketService } from 'app/modules/venta/services/venta-ticket.service';
import { VentaOptica } from 'app/modules/optica/models/venta-optica';
import { Inventario } from 'app/modules/inventario/models/inventario.models';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  providers: [
    VentaService,
    ContactoService, 
    InventarioService,
    DialogBoxService, 
    DialogPagosService, 
    VentaTicketService
  ]
})
export class VentasComponent extends VentaOptica implements OnInit {

  venta: Venta;
  clienteID: number;
  listaPrecioID: number;
  sucursalID: number;
  loading: boolean = false;

  constructor(
    private _contactoService: ContactoService,
    private _ventaService: VentaService,
    private _inventarioService: InventarioService,
    private _printService: VentaTicketService,
    private dialog: DialogBoxService,
    private pagosDialog: DialogPagosService,
    private router: Router,
    private route: ActivatedRoute) { 
      super();
  }

  @ViewChild('ticketVenta') ticketVenta: ViewContainerRef;

  ngOnInit() {
    //TODO: Obtener la lista de precios de la sucursal
    this.listaPrecioID = 1;
    this.sucursalID = 1;
    this.clienteID = this.route.snapshot.params['clienteID'];

    this.nuevaVenta();
    //TODO: Agregar loadeder
  }

  nuevaVenta(){
    this.venta = new Venta();

    //Obtiene el paciente
    if(this.clienteID){
      this._contactoService.getByID(this.clienteID)
        .subscribe((data: Contacto) => {
          this.venta.sumary.cliente = data;
        });
    }

    //Validacion de inventario
    this.venta.onDetalleChanged.subscribe((items: DetalleVenta[]) =>{
      items.forEach(item=>{
        this._inventarioService.getInventarioProducto(Number(item.productoVenta.key), this.sucursalID)
          .subscribe((inv: Inventario)=> {
            if(inv.cantidad <= 0){
              this.dialog.openDialog(
                'Advertencia', 
                `No hay ${item.productoVenta.nombre} en el inventario. ¿Desea continuar?`, 
                true, 
                res =>{
                  console.log(res ? 'No hacer nada': 'Remover producto');
                });
            }
          });
      });
    })
  }

  isVentaInvalid(){
    let rval = true;
    if(this.venta.detalle.length > 0){
      if(this.showOptica){
        rval = this.venta.detalle.find(d=> { return d.productoVenta.key === 999999 }) ? false : true;
        if(!rval){
          rval = this.venta.comentarios.filter(c=> c.moduleID === 995).length === 0;
        }
      }
      else rval = false;
    }
    return rval;
  }

  onSaveVenta(){
    this.pagosDialog.openDialog(this.venta, (pagos: DetallePagos[]) => {
      if(pagos){
        this.venta.pagos = pagos.map(p=> {
          p.esPagoInicial = true;
          return p;
        });
        this._ventaService.saveVenta(this.venta, this.sucursalID, (newVenta: Venta) => {
          if(newVenta){
            this._printService.venta = this.venta;
            this._printService.examen = this.examen;
            this._printService.esPagoInicial = true;
            this._printService.print();
            this.router.navigate(['']);
          }
          else{
            this.dialog.openDialog('Error', 'Ocurrio un error al generar la venta', false);
            this.venta.sumary.totalPagado = 0;
          }
        });
      }
    })
  }

  onProductoAdded(item: DetalleVenta){
    let currentItem = this.venta.detalle.find(dv => dv.productoVenta.key === item.productoVenta.key);
    if(currentItem){
      item.cantidad += currentItem.cantidad;
    }
    let newDetalle = 
        (currentItem ? 
        this.venta.detalle.filter(dv => dv.productoVenta.key !== item.productoVenta.key) : 
        this.venta.detalle)
        .concat(item);
    this.venta.updateDetalleVenta(newDetalle);
  }

  onDetalleChanged(newValue){
    if(newValue){
      this.venta.updateDetalleVenta(newValue);
    }
  }

  //Optica
  showOptica: boolean = true;

  onExamenChanged(value){
    this.showOptica = value ? true :  false;
    super.onExamenChanged(value);
  }
}