import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Venta, DetalleVenta, DetallePagos, SumaryVenta, MetodoPago, ComentariosVenta } from '../models/venta.models';
import { Sucursal } from 'app/modules/generic-catalogs/models/generic-catalogs.models';
import { Status } from 'app/modules/base/models/base.models';
import { Producto } from 'app/modules/producto/models/producto.models';

import { BaseAjaxService } from '../../base/services/base-ajax.service'
import { ContactoService } from 'app/modules/crm/services/contacto.service';
import { GenericService, GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';
import { Subject } from 'rxjs';

@Injectable()
export class VentaService implements GenericServiceBase<Venta> {
    
    constructor(
        private db: BaseAjaxService,
        private _contactoService: ContactoService
    ) { }

    newInstance(): Venta {
        return new Venta();
    }

    mapDetalleVenta2Server(detalle: DetalleVenta[]){
        let arr = detalle.map(dv => {
            return `${dv.productoVenta.key},${dv.cantidad},${dv.precioUnitario - dv.descuento},${dv.importe}`
        })
        arr = ['C0,C1,C2,C3', ...arr];
        return arr.join('&');
    }

    mapDetallePagos2Server(detalle: DetallePagos[]){
        let arr = detalle.map(dp => {
            return `${dp.metodoPago.key},${dp.monto},${dp.totalRecibido}`
        })
        arr = ['C0,C1,C2', ...arr];
        return arr.join('&');
    }

    mapComentarioVenta2Server(comentarios: ComentariosVenta[]){
        let arr = comentarios.map(c => {
            return `${c.productoID ? c.productoID : 0 },${c.comentario}`
        })
        arr = ['C0,C1', ...arr];
        return arr.join('&');
    }

    mapList(list: any[]): Venta[]{
        return list.map(p=>{
            return this.mapData(p);
        })
    }
    
    mapData(item: any): Venta {
        let venta = new Venta();
        venta.sumary.key = item.C0;
        venta.sumary.sucursal.nombre = item.R2;
        venta.sumary.fecha = moment(item.C1).toDate();
        venta.sumary.subTotal = item.C2;
        venta.sumary.impuestos = 0;
        venta.sumary.totalPagado = item.C3;
        venta.sumary.status = new Status();
        //STATUS
        venta.sumary.status.key = item.R3;
        venta.sumary.status.nombre = item.R2;
        //VENDEDOR
        venta.sumary.vendedor.key = item.C5;
        venta.sumary.vendedor.nombre = item.R5;
        //CLIENTE
        venta.sumary.cliente.key = item.C4;
        venta.sumary.cliente.persona.nombre = item.R1;

        return venta;
    }

    mapDetalleVentaData(item: any): DetalleVenta {
        let dv = new DetalleVenta(new Producto(item.C2));
        dv.productoVenta.key =  item.C0;
        dv.cantidad = item.C1;
        dv.precioUnitario = item.C3;
        dv.comentario = item.C10;
        return dv;
    }

    mapDetallePagosData(item: any): DetallePagos {
        let dp = new DetallePagos();
        dp.key = item.C0;
        dp.fecha = moment(item.C3).toDate();
        dp.metodoPago = new MetodoPago();
        dp.metodoPago.nombre = item.C1;
        dp.monto = item.C2;
        dp.totalRecibido = item.C6;
        dp.esPagoInicial = item.C4;
        dp.corteID = item.C5;
        return dp;
    }

    mapComentariosData(item: any): ComentariosVenta {
        let c = new ComentariosVenta(item.C2);
        c.key = item.C0;
        c.productoID = item.C1;
        return c;
    }

    registarPago(ventaID: number, pagos: DetallePagos[]){
        let total = pagos.map(p=> p.monto).reduce((p, n) => p + n);
        let params = this.db.createParameter('ECOM0002', 6, {
            'V3': ventaID,
            'V4': total,
            'V6': this.mapDetallePagos2Server(pagos)
        });
        return this.db.getData(params);
    }

    saveVenta(venta: Venta, sucursalID: number, callback){
        venta.sumary.totalPagado = venta.pagos.map(p=> p.monto).reduce((c, p) => c + p);
        let params = this.db.createParameter('ECOM0002', 1, {
            'V3': venta.sumary.cliente ? venta.sumary.cliente.key : 0,
            'V4': sucursalID <= 0 ? venta.sumary.sucursal.key : sucursalID,
            'V5': venta.sumary.total,
            'V6': this.mapDetalleVenta2Server(venta.detalle),
            'V7': this.mapDetallePagos2Server(venta.pagos),
            'V13': this.mapComentarioVenta2Server(venta.comentarios),
            'V8': venta.sumary.totalPagado,
            //Es a Credito? (1, 0)
            'V9': 0,
            //Periocidad
            'V10': 0,
            //No Pagos
            'V11': 0,
            //Vendedor
            'V12': 0
        });
        this.db.getData(params).subscribe(res=>{
            if (res.Table[0].C1 > 0) {
                //All correct
                venta.sumary.key = res.Table[0].C0;
                callback(venta);
            }
            else {
                callback(null);
            }
        });
    }

    save(_currentValue: Venta, _newValue: Venta) {
        throw new Error("Method not implemented.");
    }

    changeStatus(ID: number, status: number, internal: boolean = false){
        let params = this.db.createParameter('ECOM0002', 2, { 
            V3: internal ? 1 : 0,
            V4: ID,
            V5: status
        });
        return this.db.getData(params);
    }

    cancelOrder(ID: number){
        this.changeStatus(ID, 40102, true);
    }

    getByID(ID: number){
        let observable$: Subject<Venta> = new Subject();
        let params = this.db.createParameter('ECOM0003', 2, { V3: ID });

        this.db.getData(params).subscribe(data=>{
            let header = data.Table[0];
            let venta = this.mapData(header);
            
            venta.updateDetalleVenta(data.Table1.map( row => this.mapDetalleVentaData(row)));
            venta.pagos = data.Table2.map( row => this.mapDetallePagosData(row));
            venta.comentarios = data.Table3.map( row => this.mapComentariosData(row));
            //observable$.next(venta);
            this._contactoService.getByID(venta.sumary.cliente.key)
                .subscribe((result) => {
                    venta.sumary.cliente = result;
                    observable$.next(venta);
                });
        })
        return observable$;
    }

    getOrdenesPendientesEntrega(sucursalID: number, clienteID: number){
        let params = this.db.createParameter('ECOM0003', 3, { 
            V4: sucursalID ? sucursalID : '',
            V8: clienteID ? clienteID : '',
        });
        return this.db.getData(params)
            .map(result => this.mapList(result.Table));
    }

    getHistorialCompras(clienteID: number){
        let params = this.db.createParameter('ECOM0003', 4, { 
            V3: clienteID ? clienteID : '',
        });
        return this.db.getData(params)
            .map(result => this.mapList(result.Table));
    }
}