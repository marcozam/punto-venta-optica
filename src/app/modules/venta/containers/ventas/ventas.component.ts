import { Component, OnInit, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RxJs
import { switchMap } from 'rxjs/operators';
// Models
import { Contacto } from 'app/modules/crm/models/crm.models';
import { Inventario } from 'app/modules/inventario/models/inventario.models';
import { Venta, DetalleVenta, DetallePagos } from '../../models/venta.models';
// Services
import { ApplicationService } from 'app/services';
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
    private applicationService: ApplicationService,
    private contactoService: ContactoService,
    private _ventaService: VentaService,
    private _inventarioService: InventarioService,
    private dialog: DialogBoxService,
    private pagosDialog: DialogPagosService,
    private route: ActivatedRoute) { }

  @ViewChild('ticketVenta', { static: false }) ticketVenta: ViewContainerRef;

  ngOnInit() {
    // TODO: Agregar loadeder
    // TODO: Obtener la lista de precios de la sucursal
    this.listaPreciosID = 1;
    this.route.params
      .pipe(switchMap(({ clienteID }) => this.contactoService.getByID(clienteID)))
      .subscribe(cliente => this.nuevaVenta(cliente));
  }

  nuevaVenta(cliente: Contacto) {
    const { sucursal, user } = this.applicationService;
    this.venta = new Venta(sucursal, user);
    this.cliente = cliente;
    // Validacion de inventario
    this.venta.onDetalleChanged.subscribe((items: DetalleVenta[]) => {
      items.forEach(item => {
        this._inventarioService.getInventarioProducto(item.productoVenta.key, sucursal.key)
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
        this._ventaService.saveVenta(this.venta).subscribe(newVenta => {
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
