import { Component, OnInit, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { Contacto } from 'app/modules/crm/models/crm.models';
import { Inventario } from 'app/modules/inventario/models/inventario.models';
import { Venta, DetalleVenta, DetallePagos } from '../../models/venta.models';
// Services
import { VentaService } from '../../services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { InventarioService } from 'app/modules/inventario/services/inventario.service';
import { DialogPagosService } from 'app/modules/pagos/services/dialog-pagos.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

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
  ]
})
export class VentasComponent implements OnInit {
  loading = false;
  private _venta: Venta;
  @Output() ventaChange: EventEmitter<Venta> = new EventEmitter();
  @Input()
  get venta(): Venta { return this._venta; }
  set venta(value) {
    this._venta = value;
    this.ventaChange.emit(this._venta);
  }

  private _sucursalID: number;
  @Output() sucursalIDChange: EventEmitter<number> = new EventEmitter();
  @Input()
  get sucursalID(): number { return this._sucursalID; }
  set sucursalID(value) {
    this._sucursalID = value;
    this.sucursalIDChange.emit(this.sucursalID);
  }

  private _clienteID: number;
  @Output() clienteIDChange: EventEmitter<number> = new EventEmitter();
  @Input()
  get clienteID(): number { return this._clienteID; }
  set clienteID(value) {
    this._clienteID = value;
    this.clienteIDChange.emit(this.clienteID);
  }

  private _listaPreciosID: number;
  @Output() listaPreciosIDChange: EventEmitter<number> = new EventEmitter();
  @Input()
  get listaPreciosID(): number { return this._listaPreciosID; }
  set listaPreciosID(value) {
    this._listaPreciosID = value;
    this.listaPreciosIDChange.emit(this.listaPreciosID);
  }

  constructor(
    private _contactoService: ContactoService,
    private _ventaService: VentaService,
    private _inventarioService: InventarioService,
    private dialog: DialogBoxService,
    private pagosDialog: DialogPagosService,
    private router: Router,
    private route: ActivatedRoute) { }

  @ViewChild('ticketVenta') ticketVenta: ViewContainerRef;

  ngOnInit() {
    // TODO: Agregar loadeder
    // TODO: Obtener la lista de precios de la sucursal
    this.listaPreciosID = 1;
    this.sucursalID = 1;
    this.clienteID = this.route.snapshot.params['clienteID'];
    this.nuevaVenta();
  }

  nuevaVenta() {
    this.venta = new Venta();
    // Obtiene el paciente
    if (this.clienteID) {
      this._contactoService.getByID(this.clienteID)
        .subscribe((data: Contacto) => { this.venta.sumary.cliente = data; });
    }

    // Validacion de inventario
    this.venta.onDetalleChanged.subscribe((items: DetalleVenta[]) => {
      items.forEach(item => {
        this._inventarioService.getInventarioProducto(Number(item.productoVenta.key), this.sucursalID)
          .subscribe((inv: Inventario) => {
            if (inv.cantidad <= 0) {
              this.dialog.openDialog(
                'Advertencia',
                `No hay ${item.productoVenta.nombre} en el inventario. ¿Desea continuar?`,
                true,
                res => { console.log(res ? 'No hacer nada' : 'Remover producto'); });
            }
          });
      });
    });
  }

  isVentaInvalid() {
    let rval = true;
    if (this.venta.detalle.length > 0) { rval = false; }
    return rval;
  }

  onSaveVenta() {
    this.pagosDialog.openDialog(this.venta, (pagos: DetallePagos[]) => {
      if (pagos) {
        this.venta.pagos = pagos.map(p => {
          p.esPagoInicial = true;
          return p;
        });
        this._ventaService.saveVenta(this.venta, this.sucursalID, (newVenta: Venta) => {
          if (newVenta) {
            this.onSaveVenta();
          } else {
            this.dialog.openDialog('Error', 'Ocurrio un error al generar la venta', false);
            this.venta.sumary.totalPagado = 0;
          }
        });
      }
    });
  }

  // Redirect to Home
  onVentaSaved() { this.router.navigate(['']); }

  onProductoAdded(item: DetalleVenta) {
    const currentItem = this.venta.detalle.find(dv => dv.productoVenta.key === item.productoVenta.key);
    if (currentItem) { item.cantidad += currentItem.cantidad; }
    const newDetalle = (currentItem ?
        this.venta.detalle.filter(dv => dv.productoVenta.key !== item.productoVenta.key) :
        this.venta.detalle)
        .concat(item);
    this.venta.updateDetalleVenta(newDetalle);
  }

  onDetalleChanged(value: DetalleVenta[]) { this.venta.updateDetalleVenta(value, false); }
}
