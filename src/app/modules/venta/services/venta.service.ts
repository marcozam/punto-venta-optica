import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Venta, DetalleVenta, DetallePagos, SumaryVenta, MetodoPago, ComentariosVenta } from '../models/venta.models';
import { BaseAjaxService } from '../../base/services/base-ajax.service'
import { Sucursal, Status } from 'app/modules/generic-catalogs/models/generic-catalogs.models';
import { Producto } from 'app/modules/producto/models/producto.models';
import { ContactoService } from 'app/modules/crm/services/contacto.service';

@Injectable()
export class VentaService {
    
    constructor(
        private _osBD: BaseAjaxService,
        private _contactoService: ContactoService
    ) { }

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

    mapList(list: any[]){
        return list.map(p=>{
            return this.mapData(p);
        })
    }
    
    mapData(item: any) {
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

    registarPago(ventaID: number, pagos: DetallePagos[]){
        let total = pagos.map(p=> p.monto).reduce((p, n) => p + n);
        let params = this._osBD.createParameter('ECOM0002', 6, {
            'V3': ventaID,
            'V4': total,
            'V6': this.mapDetallePagos2Server(pagos)
        });
        return this._osBD.getData(params);
    }

    saveVenta(venta: Venta, sucursalID: number, callback){
        venta.sumary.totalPagado = venta.pagos.map(p=> p.monto).reduce((c, p) => c + p);
        let params = this._osBD.createParameter('ECOM0002', 1, {
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
        this._osBD.getData(params).subscribe(res=>{
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

    getByID(ID: number, callback){
        let params = this._osBD.createParameter('ECOM0003', 2, { V3: ID });
        this._osBD.getData(params).subscribe(data => {
            let header = data.Table[0];
            let venta = this.mapData(header);
            venta.updateDetalleVenta(data.Table1.map( row => {
                let dv = new DetalleVenta(new Producto(row.C2));
                dv.productoVenta.key =  row.C0;
                dv.cantidad = row.C1;
                dv.precioUnitario = row.C3;
                dv.comentario = row.C10;
                return dv;
            }));

            venta.pagos = data.Table2.map( row => {
                let dp = new DetallePagos();
                dp.key = row.C0;
                dp.fecha = moment(row.C3).toDate();
                dp.metodoPago = new MetodoPago();
                dp.metodoPago.nombre = row.C1;
                dp.monto = row.C2;
                dp.totalRecibido = row.C6;
                dp.esPagoInicial = row.C4;
                dp.corteID = row.C5;
                return dp;
            });

            venta.comentarios = data.Table3.map( row => {
                let c = new ComentariosVenta(row.C2);
                c.key = row.C0;
                c.productoID = row.C1;
                return c;
            });

            this._contactoService.getByID(venta.sumary.cliente.key)
                .subscribe((res)=>{
                venta.sumary.cliente = res;
                callback(venta);
            });
        });
    }

    getOrdenesPendientesEntrega(sucursalID: number, callback){
        let params = this._osBD.createParameter('ECOM0003', 3, { V4: sucursalID});
        this._osBD.getData(params)
            .subscribe(res => {
                callback(this.mapList(res.Table));
            });
    }
}