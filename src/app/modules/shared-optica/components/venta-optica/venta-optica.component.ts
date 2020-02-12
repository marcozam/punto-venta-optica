import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionList, MatListOption } from '@angular/material/list';

import { SelectionChange } from '@angular/cdk/collections';
import { Observable, merge } from 'rxjs';

// Models
import { OpticaVentaChangeEvent } from '../../models/optica-venta.models';
import { Producto } from 'app/modules/producto/models/producto.models';
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { DetalleVenta, ComentariosVenta } from 'app/modules/venta/models/venta.models';
import { Examen, TratamientoMica, TratamientoMicaPrecios } from 'app/modules/optica/models/examen.models';
import { Contacto } from '../../../crm/models/crm.models';
// Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { ExamenService } from 'app/modules/optica/services/examen.service';
import { TratamientoMicasService } from 'app/modules/optica/services/tratamiento-micas.service';

// 999 => Armazon
// 998 => Mica
// 997 => Tratamientos
// 995 => Medidas

@Component({
  selector: 'app-venta-optica',
  templateUrl: './venta-optica.component.html',
  styleUrls: ['./venta-optica.component.scss'],
  providers: [TratamientoMicasService, ExamenService]
})
export class VentaOpticaComponent implements OnInit {

  loading$: Observable<boolean>;
  loading = false;

  // Tratamientos
  allTratamientos: TratamientoMica[];
  tratamientos: TratamientoMicaPrecios[];
  tempTratamientos: DetalleVenta[] = [];
  comentariosOptica: ComentariosVenta[] = [];

  @Input() listaPrecioID: number;
  @Input() esVenta = true;
  @Input() detalleVenta: DetalleVenta[];

  @Input()
  get examen(): Examen { return this._examen; }
  set examen(value) {
    this._examen = value;
    if (value) { this.addMica(); }
    this.examenChange.emit(this._examen);
  }
  private _examen: Examen;
  @Output() examenChange: EventEmitter<Examen> = new EventEmitter();

  private _paciente: Contacto;
  @Input()
  get paciente(): Contacto { return this._paciente; }
  set paciente(value) {
    this._paciente = value;
    if (this._paciente) {
      this._examenService.getLastExamen(this._paciente.key)
        .subscribe((examen: Examen) => {
          if (examen) {
            this.examen = examen;
          } else {
            this.dialog.openDialog('Advertencia!!', 'El cliente no cuenta con un examen registrado.', false);
            this.examen = null;
          }
        });
    }
  }

  @Output() onProdutsChanged: EventEmitter<OpticaVentaChangeEvent> = new EventEmitter();

  @ViewChild(MatSelectionList, { static: true }) tratamientoList: MatSelectionList;

  constructor(
    private _examenService: ExamenService,
    private _tratamientosService: TratamientoMicasService,
    private dialog: DialogBoxService) {
    this.loading$ = merge(_examenService.loading$, _tratamientosService.loading$);
  }

  createSubscriptions() {
    this.loading$.subscribe(() => this.loading = this._examenService.isLoading || this._tratamientosService.isLoading);
    this._tratamientosService.source$.subscribe(data => this.allTratamientos = data);
  }

  ngOnInit() {
    this.createSubscriptions();
    // Obtiene los tratamientos
    this._tratamientosService.getList();

    // Listen to changes on tratamientos
    this.tratamientoList.selectedOptions.onChange.subscribe((list: SelectionChange<MatListOption>) => {
      if (list.removed.length > 0) {
        list.removed.forEach(t => this.removeVentaDetail(t.value.productID));
      }
      if (list.added.length > 0) {
        list.added.forEach(t => {
          const _producto: Producto = new Producto(t.value.tratamiento.nombre);
          _producto.key = t.value.productID;
          this.addVentaDetail(_producto, t.value.precio, 997);
        });
      }
    });
  }

  setMicaValues(key: string, value: GenericCatalog) {
    if (this.examen[`${key}ID`] !== value.key) {
      this.examen[`${key}ID`] = value.key;
      this.examen[key] = value.nombre;
    }
  }

  onMicaChange(_change: any) {
    this.setMicaValues(_change.key, _change.value);
    this.tempTratamientos = this.detalleVenta.filter(dv => dv.moduleID === 997);
    // Remueve todos los tratamientos
    this.removeVentaDetail(997, true);
    this.addMica();
  }

  addMica() {
    if (this.examen.key > 0) {
      this._examenService.getPrecio(this.listaPrecioID, this.examen.materialRecomendadoID, this.examen.tipoMicaRecomendadoID)
        .subscribe((precioMica) => {
          if (precioMica) {
            this.setValidTratamientos(precioMica.tratamientos);
            const comentario = `${this.examen.tipoMicaRecomendado.toUpperCase()} - ${this.examen.materialRecomendado.toUpperCase()}`;
            const _producto: Producto = new Producto('MICA');
            _producto.key = 999999;
            this.addVentaDetail(_producto, this._examenService.getPrecioMica(this.examen, precioMica), 998, comentario);
            this.comentariosOptica.push({
                productoID: _producto.key,
                comentario: comentario,
                key: 0,
                moduleID: 998
              });
          } else { console.warn('Combination not allow'); }
        });
    }
  }

  setValidTratamientos(tm: TratamientoMicaPrecios[]) {
    this.tratamientos = tm.map(item => {
      item.tratamiento = this.allTratamientos.find(tr => tr.key === item.tratamientoID);
      return item;
    });
  }
  // Manage Armazon
  onArmazonChanged(event) {
    if (event.removed) { this.removeVentaDetail(event.removed.key); }
    if (event.isComment) {
      this.removeComments(event.moduleID);
      this.comentariosOptica = this.comentariosOptica.concat(event.added);
      this.sendChanges([]);
    } else { this.addVentaDetail(event.added.producto, event.added.precio, 999); }
  }

  // General Management
  addVentaDetail(producto: Producto, precio: number, moduleID: number = 998, comentario?: string) {
    const detalleVenta: DetalleVenta = new DetalleVenta(producto, precio);
    detalleVenta.canEditCantidad = false;
    detalleVenta.canBeRemoved = producto.key === 999999;
    detalleVenta.moduleID = moduleID;
    detalleVenta.comentario = comentario;
    this.sendChanges([detalleVenta]);
  }

  removeVentaDetail(key: number, isModule?: boolean) {
    if (!isModule) {
      this.sendChanges(this.detalleVenta.filter(dv => dv.productoVenta.key === key), true);
      this.comentariosOptica = this.comentariosOptica.filter(c => c.productoID !== key);
    } else {
      this.sendChanges(this.detalleVenta.filter(dv => dv.moduleID === key), true);
      this.removeComments(key);
    }
  }

  removeComments(moduleID: number) {
    this.comentariosOptica = this.comentariosOptica.filter(c => c.moduleID !== moduleID);
  }

  sendChanges(data: DetalleVenta[], isRemove: boolean = false) {
    this.onProdutsChanged.emit({
      detalle: data,
      comentarios: this.comentariosOptica,
      isRemove: isRemove
    });
  }
}
