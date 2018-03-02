import { Component, OnInit, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Models
import { Contacto } from 'app/modules/crm/models/crm.models';
import { Inventario } from 'app/modules/inventario/models/inventario.models';
import { Venta, DetalleVenta, DetallePagos } from '../../models/venta.models';
// Services
import { VentaService } from '../../services/venta.service';
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { InventarioService } from 'app/modules/inventario/services/inventario.service';
import { DialogPagosService } from 'app/modules/venta-common/services/dialog-pagos.service';
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

  @Input() sucursalID: number;
  @Input() clienteID: number;

  private _listaPreciosID: number;
  @Input()
  get listaPreciosID(): number { return this._listaPreciosID; }
  set listaPreciosID(value) {
    this._listaPreciosID = value;
    this.listaPreciosIDChange.emit(this._listaPreciosID);
  }
  @Output() listaPreciosIDChange: EventEmitter<number> = new EventEmitter();

  private _venta: Venta;
  @Input()
  get venta(): Venta { return this._venta; }
  set venta(value) {
    this._venta = value;
    this.ventaChange.emit(this._venta);
  }
  @Output() ventaChange: EventEmitter<Venta> = new EventEmitter();

  @Input()
  get cliente(): Contacto { return this.venta.sumary.cliente; }
  set cliente(value) {
    this.venta.sumary.cliente = value;
    this.clienteChange.emit(this.venta.sumary.cliente);
  }
  @Output() clienteChange: EventEmitter<Contacto> = new EventEmitter();

  @Output() onVentaSaved: EventEmitter<Venta> = new EventEmitter();

  constructor(
    private _contactoService: ContactoService,
    private _ventaService: VentaService,
    private _inventarioService: InventarioService,
    private dialog: DialogBoxService,
    private pagosDialog: DialogPagosService,
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
        .subscribe((data: Contacto) => {
          this.cliente = data;
        });
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
            this.onVentaSaved.emit(newVenta);
          } else {
            this.dialog.openDialog('Error', 'Ocurrio un error al generar la venta', false);
            this.venta.sumary.totalPagado = 0;
          }
        });
      }
    });
  }

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
